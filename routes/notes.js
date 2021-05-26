const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  try {
    res.send(await Note.findMany());
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

notesRouter.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne(req.params.id);
    if (note) res.send(note);
    else res.sendStatus(404);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

notesRouter.post('/', async (req, res) => {
  const validationErrors = Note.validate(req.body);
  if (validationErrors) {
    res.status(422).send({ validationErrors: validationErrors.details });
  } else {
    try {
      res.status(201).send(await Note.create(req.body));
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
});

notesRouter.patch('/:id', async (req, res) => {
  try {
    const existingNote = await Note.findOne(req.params.id);
    if (!existingNote) return res.sendStatus(404);
    const validationErrors = Note.validate(req.body, true);
    if (validationErrors)
      return res.status(422).json({ errors: validationErrors.details });
    await Note.update(req.params.id, req.body);
    return res.json({ ...existingNote, ...req.body });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

notesRouter.delete('/:id', async (req, res) => {
  try {
    if (await Note.destroy(req.params.id)) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = notesRouter;
