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
        required: true,
        minLength: 4,
        select: false,
        // validate: {
        //     validate: (el) => {
        //         return el.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/);
        //     }, 
        //     message: 'Password must contain at least 8 characters with alphanumeric characters and a special characters!'
        // }
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
    }
});


schema.pre('save', async function (next) {
    if (!this.isModified()) {
        return next();
    } else {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

const User = mongoose.model('User', schema);

module.exports = User;