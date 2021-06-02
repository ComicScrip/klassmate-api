const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  const validationErrors = User.validate(req.body);
  if (validationErrors)
    return res.status(422).send({ errors: validationErrors.details });

  if (await User.emailAlreadyExists(req.body.email))
    return res.status(422).send({ error: 'this email is already taken' });

  const newUser = await User.create(req.body);
  return res.status(201).send({ id: newUser.id, email: newUser.email });
});

module.exports = usersRouter;
