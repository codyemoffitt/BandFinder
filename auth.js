const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URI
      },
      (token, refreshToken, profile, done) => {
        console.log(profile);
        return done(null, {
          profile: profile,
          token: token
        });
      }
    )
  );
};
