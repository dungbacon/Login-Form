const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        host: process.env.NODE_MAILER_HOST,
        port: process.env.NODE_MAILER_PORT,
        auth:{
            user: process.env.NODE_MAILER_USERNAME,
            pass: process.env.NODE_MAILER_PASSWORD
        }
    }
);

module.exports = transporter;