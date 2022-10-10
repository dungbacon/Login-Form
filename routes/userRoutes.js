const express = require('express');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./../models/userModel');
const userController = require('./../controllers/userController');
const app = express();

passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile'],

    },
    catchAsync(async(accessToken, refreshToken, profile, done) => {
        console.log(profile);
        // Check if the user with googleId is exist?
    })
));

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google'));

router.get('/login', (req, res, next) => {
    var options = {
        root: path.join('assets')
    };

    var fileName = 'index.html';
    res.sendFile(fileName, options, function(err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
            next();
        }
    });
});


router.post('/resetPassword/:token', userController.resetPassword);

router.post('/forgotpassword', userController.forgotPassword);

router.get('/info', userController.protect, userController.getAllUser);

router.post('/login', userController.login);

router.post('/updatepassword/:id', userController.protect, userController.updatePassword);

module.exports = router;