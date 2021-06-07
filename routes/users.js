const usersRouter = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const requireCurrentUser = require('../middlewares/requireCurrentUser');
const handleImageUpload = require('../middlewares/handleImageUpload');
const User = require('../models/user');
const { API_BASE_URL } = require('../env');

usersRouter.post('/', async (req, res) => {
  const validationErrors = User.validate(req.body);
  if (validationErrors)
    return res.status(422).send({ errors: validationErrors.details });

  if (await User.emailAlreadyExists(req.body.email))
    return res.status(422).send({ error: 'this email is already taken' });

  const newUser = await User.create(req.body);
  return res.status(201).send({ id: newUser.id, email: newUser.email });
});

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
    const data = { ...req.body };
    if (req.file && req.file.path) {
      data.avatarUrl = req.file.path;
    }
    const updated = await User.update(req.params.id, data);
    const { id, firstName, lastName, avatarUrl } = updated;
    res.send({
      id,
      firstName,
      lastName,
      avatarUrl: `${API_BASE_URL}/${avatarUrl}`,
    });
  })
);

module.exports = usersRouter;
