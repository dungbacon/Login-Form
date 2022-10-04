const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const e = require('express');

const isEmail = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email must be provided!'],
        validate: [isEmail, 'Email must be a valid email address!']
    },
    password: {
        type: String,
        required: [true, 'Password must be provided!'],
        minLength: 4,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: {
        type: Date
    },
});

schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    console.log('Encrypt password');
    this.password = await bcrypt.hash(this.password, 12);
});

schema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.passwordChangedAt = Date.now();
    } else {
        next();
    }
});

schema.methods.ChangePasswordAfter = function(issueAtTime, changePasswordAt){
    if(!this.changePasswordAt){
        changePasswordAt = Date.now().getTime();
    }
    return issueAtTime > changePasswordAt;
};

schema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', schema);

module.exports = User;