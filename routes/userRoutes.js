const express = require('express');
const path = require('path');
const passport = require('passport');
require('./../utils/passport')
// const googleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./../models/userModel');
const userController = require('./../controllers/userController');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

const app = express();

const router = express.Router();

router.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/info',
    failureRedirect: '/login',
}));

router.get('/login', (req, res, next) => {
    var options = {
        root: path.join('assets')
    };

    var fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
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