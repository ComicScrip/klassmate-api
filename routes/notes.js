const notesRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const Note = require('../models/note');
const {
  RecordNotFoundError,
  ValidationError,
  ForbiddenActionError,
} = require('../error-types');
const requireCurrentUser = require('../middlewares/requireCurrentUser');

notesRouter.get(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const {
      limit = 10,
      offset = 0,
      titleOrContentContains,
      authorId,
    } = req.query;

    res.send(
      await Note.search({ limit, offset, titleOrContentContains, authorId })
    );
  })
);

notesRouter.get(
  '/:id',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const note = await Note.findOne(req.params.id);
    if (note) res.send(note);
    else throw new RecordNotFoundError();
  })
);

notesRouter.post(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const validationErrors = Note.validate(req.body);
    if (validationErrors) {
      throw new ValidationError(validationErrors.details);
    } else {
      res
        .status(201)
        .send(await Note.create({ ...req.body, authorId: req.currentUser.id }));
    }
  })
);

notesRouter.patch(
  '/:id',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const existingNote = await Note.findOne(req.params.id);
    if (!existingNote) throw new RecordNotFoundError();
    const validationErrors = Note.validate(req.body, true);
    if (
      req.currentUser.role !== 'admin' &&
      existingNote.authorId !== req.currentUser.id
    )
      throw new ForbiddenActionError();
    if (validationErrors) throw new ValidationError(validationErrors.details);
    await Note.update(req.params.id, req.body);
    return res.json({ ...existingNote, ...req.body });
  })
);

notesRouter.delete(
  '/:id',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const existingNote = await Note.findOne(req.params.id);
    if (
      req.currentUser.role !== 'admin' &&
      existingNote.authorId !== req.currentUser.id
    )
      throw new ForbiddenActionError();
    if (await Note.destroy(req.params.id)) res.sendStatus(204);
    else throw new RecordNotFoundError();
  })
);

module.exports = notesRouter;
