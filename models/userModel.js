const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
        validate: [isEmail, 'Email must be a valid email address!']
    },
    password: {
        type: String,
        minLength: 4,
        select: false,
    },
    passwordConfirmation: {
        type: String,
        minLength: 4,
        validate: {
            validator: function(passwordCf) {
                return this.password.match(passwordCf);
            },
            message: 'Password confirmation does not match'
        }
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
    passwordResetExpires: Date,
    passwordResetToken: String,
    googleID: String
});

schema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    } else {
        console.log('Encrypt password');
        this.password = await bcrypt.hash(this.password, 12);
        next();
    }
});

schema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.passwordChangedAt = Date.now();
    } else {
        next();
    }
});

schema.methods.ChangePasswordAfter = function(issueAtTime) {
    // console.log(this.passwordChangedAt.getTime()/1000);
    if (!this.passwordChangedAt) {
        this.passwordChangedAt = Date.now().getTime() / 1000;
    }
    return issueAtTime > this.passwordChangedAt.getTime() / 1000;
};

schema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

schema.methods.createResetToken = function(req) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        // Create Hmac object with algorithm sha256 and secret key (Similar to createHash())
        .createHmac('sha256', process.env.JWT_SECRET)
        // Update Hmac content with given data. 
        // Second parameter is encoded with utf-8 encoding method.
        .update(resetToken)
        .digest('hex');
    const expiresIn = 20 * 1000; // 10 minutes
    this.passwordResetExpires = Date.now() + expiresIn;
    return resetToken;
};

const User = mongoose.model('User', schema);

module.exports = User;