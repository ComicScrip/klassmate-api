const activitiesRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const Activity = require('../models/activity');
const { RecordNotFoundError, ValidationError } = require('../error-types');
const requireCurrentUser = require('../middlewares/requireCurrentUser');

activitiesRouter.get(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0, nameContains } = req.query;

    res.send(await Activity.search({ limit, offset, nameContains }));
  })
);

activitiesRouter.get(
  '/:id',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const note = await Activity.findOne(req.params.id);
    if (note) res.send(note);
    else throw new RecordNotFoundError();
  })
);

activitiesRouter.post(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const validationErrors = Activity.validate(req.body);
    if (validationErrors) {
      throw new ValidationError(validationErrors.details);
    } else {
      res
        .status(201)
        .send(
          await Activity.create({ ...req.body, authorId: req.currentUser.id })
        );
    }
  })
);

activitiesRouter.patch(
  '/:id',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const existingActivity = await Activity.findOne(req.params.id);
    if (!existingActivity) throw new RecordNotFoundError();
    const validationErrors = Activity.validate(req.body, true);
    if (validationErrors) throw new ValidationError(validationErrors.details);
    await Activity.update(req.params.id, req.body);
    return res.json({ ...existingActivity, ...req.body });
  })
);

activitiesRouter.delete(
  '/:id',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    if (await Activity.destroy(req.params.id)) res.sendStatus(204);
    else throw new RecordNotFoundError();
  })
);

module.exports = activitiesRouter;
