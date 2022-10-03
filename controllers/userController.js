const fs = require('fs');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

// const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/user.json`, 'utf-8'));
const User = require('./../models/userModel');

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }
    console.log(email, password);
    const user = await User.findOne({ email: email });
    console.log(user);
    console.log(await user.correctPassword(password, user.password));
    if (!user) {
        return next(new AppError(`No user found for ${email}`, 404));
    } else if (!(await user.correctPassword(password, user.password)) || user.email !== email) {
        return next(new AppError(`Password or email is incorrect`, 404));
    }
    return res.status(200).json({
        status: 200,
        message: 'Login successfully!',
        data: user
    });
});