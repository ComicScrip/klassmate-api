const studentsRouter = require('express').Router();
const User = require('../models/user');

studentsRouter.get('/', async (req, res) => {
  res.send(await User.findMany({ where: { role: 'student' } }));
});

module.exports = studentsRouter;
