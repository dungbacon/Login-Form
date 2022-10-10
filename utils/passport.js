const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../models/userModel');
const userController = require('./../controllers/userController');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile'],
},
    async (accessToken, refreshToke, profile, done) => {
        // Check if google profile exist.
        console.log(profile);
        if (profile.id) {
            await User.findOne({ googleID: profile.id })
                .then((existingUser) => {
                    console.log("This is the user: ", existingUser);
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        User.create({
                            email: profile.emails[0].value,
                            name: profile.name.familyName + " " + profile.name.givenName,
                            googleID: profile.id,
                        });
                        userController.createAndSendToken(existingUser, 200, res);
                    }
                })
        }
    }
));

module.exports = passport;
