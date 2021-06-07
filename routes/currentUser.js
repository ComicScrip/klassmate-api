const currentUserRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireCurrentUser = require('../middlewares/requireCurrentUser');
const { API_BASE_URL } = require('../env');

currentUserRouter.get(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, id, avatarUrl, meetUrl, discordId } =
      req.currentUser;

    res.json({
      firstName,
      lastName,
      id,
      avatarUrl: `${API_BASE_URL}/${avatarUrl}`,
      meetUrl,
      discordId,
    });
  })
);

module.exports = currentUserRouter;
