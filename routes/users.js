const _ = require('lodash');
const usersRouter = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const uniqid = require('uniqid');
const requireCurrentUser = require('../middlewares/requireCurrentUser');
const handleImageUpload = require('../middlewares/handleImageUpload');
const User = require('../models/user');
const { ValidationError, RecordNotFoundError } = require('../error-types');
const tryDeleteFile = require('../helpers/tryDeleteFile');
const { sendResetPasswordEmail } = require('../emailer');

usersRouter.post(
  '/',
  requireCurrentUser,
  expressAsyncHandler(async (req, res, next) => {
    if (req.currentUser.role === 'admin') next();
    else res.sendStatus(403);
  }),
  expressAsyncHandler(async (req, res) => {
    const validationErrors = User.validate(req.body);
    if (validationErrors)
      return res.status(422).send({ errors: validationErrors.details });

    if (await User.emailAlreadyExists(req.body.email))
      return res.status(422).send({ error: 'this email is already taken' });

    const newUser = await User.create(req.body);
    return res.status(201).send(User.getSafeAttributes(newUser));
  })
);

usersRouter.post(
  '/reset-password-email',
  expressAsyncHandler(async (req, res) => {
    // for security reasons, this route will always indicate success
    res.sendStatus(200);
    try {
      const user = await User.findByEmail(req.body.email);
      if (user) {
        const token = uniqid();
        await sendResetPasswordEmail(user, token);
        const hashedToken = await User.hashPassword(token);
        await User.update(user.id, { resetPasswordToken: hashedToken });
      }
    } catch (err) {
      console.error(err);
    }
  })
);

usersRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { userId, token, password } = req.body;
    const user = await User.findOne(userId);

    if (user && (await User.verifyPassword(token, user.resetPasswordToken))) {
      const newHashedPassword = await User.hashPassword(password);
      await User.update(user.id, {
        hashedPassword: newHashedPassword,
        resetPasswordToken: null,
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  })
);

usersRouter.patch(
  '/:id',
  requireCurrentUser,
  expressAsyncHandler(async (req, res, next) => {
    if (
      req.currentUser.role === 'admin' ||
      req.currentUser.id.toString() === req.params.id
    )
      next();
    else res.sendStatus(403);
  }),
  handleImageUpload.single('avatar'),
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne(req.params.id);
    const oldAvatarUrl = user.avatarUrl;
    if (!user) throw new RecordNotFoundError('users', req.params.id);
    const data = _.omit(req.body, 'avatar');

    if (req.file && req.file.path) {
      if (req.body.avatarUrl === '') {
        await tryDeleteFile(req.file.path);
      } else {
        data.avatarUrl = req.file.path;
      }
    }

    const error = User.validate(data, true);
    if (error) throw new ValidationError(error.details);

    const updated = await User.update(req.params.id, data);
    if (req.file && req.file.path) {
      await tryDeleteFile(oldAvatarUrl);
    }

    res.send(User.getSafeAttributes(updated));
  })
);

module.exports = usersRouter;
