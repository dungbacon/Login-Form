const fs = require('fs');
const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');
const nodeMailer = require('./../emailSender/sendMailBySMTP');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');


const signToken = id => {
    return jwt.sign({
            id: id
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    )
};

const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        data: user,
        token,
    });
};

exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }
    console.log(email, password);
    const user = await User.findOne({ email: email }).select('+password');
    console.log(user);
    if (!user) {
        return next(new AppError(`No user found for ${email}`, 404));
    } else if (!(await user.correctPassword(password, user.password)) || user.email !== email) {
        return next(new AppError(`Password or email is incorrect`, 404));
    }

    createAndSendToken(user, 200, res);

});

exports.updatePassword = catchAsync(async(req, res) => {
    const newPw = req.body.password;
    const id = req.params.id;
    console.log(newPw, id);
    const user = await User.findById({ _id: id }).select('+password');
    user.password = newPw;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'User password has been changed!',
        data: user
    });
});


exports.forgotPassword = catchAsync(async(req, res, next) => {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new AppError(`No user found for ${email}`, 404));
    }
    const resetToken = user.createResetToken(req, res);
    console.log(resetToken);
    await user.save({
        validateBeforeSave: false,
    });
    console.log(user);
    try {
        const mailOptions = {
            from: 'admin@example.com',
            to: user.email,
            subject: 'Forgot password token',
            text: `Your password reset token is: ${resetToken}. \n 
            The token will be automatically cancelled after 10 minutes!`
        }
        nodeMailer.sendMail(mailOptions);
        res.status(200).json({
            status: 'success',
            message: 'Email sent successfully!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        res.status(200).json({
            status: 'success',
            message: 'Cannot send email!'
        });
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    console.log(req.params.token);
    // 1: Take the resetToken out of req and create password reset token
    const currentPasswordResetToken = await crypto.createHmac('sha256', process.env.JWT_SECRET)
        .update(req.params.token)
        .digest('hex');
    // 2: Check user validation by passwordResetToken and passwordResetExpires > Date.now()
    const user = await User.findOne({
        passwordResetToken: currentPasswordResetToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
        return next(new AppError('Your reset password token has expired!', 404))
    }
    console.log(user);

    // 3: Update user password
    user.password = req.body.password
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createAndSendToken(user, 200, res);
});

exports.getAllUser = catchAsync(async(req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: users
    })
});

exports.protect = catchAsync(async(req, res, next) => {
    // 1: Get the token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        next(new AppError('You are not logged in! Please log in to get access', 401))
    }
    console.log(token);
    // 2: Verify token
    const promise = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(promise);
    const currentUser = await User.findById({ _id: promise.id });
    if (!currentUser) {
        next(new AppError('User not found!', 404));
    }
    console.log(currentUser);
    console.log(promise.iat);
    // jwt.verify(token, process.env.JWT_SECRET);
    // 3: Check if user is still valid
    if (!currentUser.ChangePasswordAfter(promise.iat)) {
        return next(new AppError('You have currently changed your password. Please log in to get access', 401));
    }
    // 4: set user
    req.user = currentUser;
    next();
});

exports.googleSignInUp = catchAsync(async(req, res, next) => {
    console.log(req.id);
});