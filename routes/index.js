const notesRouter = require('./notes');
const studentsRouter = require('./students');
const usersRouter = require('./users');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/students', studentsRouter);
  app.use('/notes', notesRouter);
};
