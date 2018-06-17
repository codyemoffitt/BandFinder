const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET for OAUTH

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/google/logout', (req, res) => {
  console.log('Logout called');
  req.logout();
  res.redirect('/');
});

module.exports = router;
