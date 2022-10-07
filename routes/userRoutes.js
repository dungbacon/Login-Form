const express = require('express');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const passport = require('passport');
const googleStrategy = require('passport-google-oidc');

const userController = require('./../controllers/userController');
const app = express();


const router = express.Router();

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
router.get('/login/google', passport.authenticate('google'));
router.post('/resetPassword/:token', userController.resetPassword);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/info', userController.protect, userController.getAllUser);
router.post('/login', userController.login);
router.post('/updatepassword/:id', userController.protect, userController.updatePassword);

module.exports = router;