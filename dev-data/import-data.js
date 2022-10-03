const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const User = require('./../models/userModel');

dotenv.config(
    {
        path: './../config.env',
    }
);

mongoose.connect(process.env.DATABASE, {
    autoIndex: true
}).then(con => {
    // console.log(con.connections);
    console.log("DB connection successfully");
}).catch(err => {
    console.log(err);
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, 'utf-8'));
console.log(users);

const importData = async () => {
    try {
        await User.create(users);
        console.log('Import successfully!');
    } catch (err) {
        console.log(err);
    }
}

importData();



