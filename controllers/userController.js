const fs = require('fs');
const jwt = require('jsonwebtoken');
const util = require('util');

const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');


const signToken = id => {
    return jwt.sign(
        {
            id: id
        },
        process.env.JWT_SECRET,
        {
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

// const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/user.json`, 'utf-8'));

exports.login = catchAsync(async (req, res, next) => {
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

exports.updatePassword = catchAsync(async (req, res) => {
    const newPw = req.body.password;
    const id = req.params.id;
    console.log(newPw, id);
    const user = await User.findById({_id: id}).select('+password');
    user.password = newPw;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'User password has been changed!',
        data: user
    });
});

exports.getAllUser = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: users
    })
});


exports.protect = catchAsync(async (req, res, next) => {
    // 1: Get the token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        next(new AppError('You are not logged in! Please log in to get access', 401))
    }
    console.log(token);
    // 2: Verify token
    const promise = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(promise);
    const user = await User.findById({_id: promise.id});
    console.log(user);
    console.log(promise.iat, new Date(user.passwordChangedAt).getTime()/1000);
    // jwt.verify(token, process.env.JWT_SECRET);
    // 3: Check if user is still valid
    // 4: set user
});