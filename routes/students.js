const studentsRouter = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const requireCurrentUser = require('../middlewares/requireCurrentUser');
const User = require('../models/user');

studentsRouter.get(
  '/',
  requireCurrentUser,
  expressAsyncHandler(async (req, res) => {
    res.send(await User.findMany({ where: { role: 'student' } }));
  })
);

module.exports = studentsRouter;
