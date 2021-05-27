const notesRouter = require('./notes');

module.exports = (app) => {
  app.use('/notes', notesRouter);
};
