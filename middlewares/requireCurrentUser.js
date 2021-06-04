const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    req.currentUser = await User.findOne(req.session.userId);
  } catch (err) {
    return res.sendStatus(401);
  }
  return next();
};
