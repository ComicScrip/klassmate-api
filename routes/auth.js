const authRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { SESSION_COOKIE_DOMAIN, SESSION_COOKIE_NAME } = require('../env');

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const user = await User.findByEmail(req.body.email);
    if (
      user &&
      (await User.verifyPassword(req.body.password, user.hashedPassword))
    ) {
      console.log('ok');
      if (req.body.stayConnected) {
        // session cookie will be valid for a week
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
      }
      req.session.userId = user.id;
      req.session.save(() => {
        res.sendStatus(200);
      });
    } else {
      res.status(401).send('Invalid Credentials');
    }
  })
);

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).send('Could not destroy session');
    res.clearCookie(SESSION_COOKIE_NAME, { domain: SESSION_COOKIE_DOMAIN });
    return res.status(200).send('session deleted');
  });
});

module.exports = authRouter;
