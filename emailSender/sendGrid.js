const sendgrid = require('@sendgrid/mail');
const User = require('./../models/userModel');

const secretKey = process.env.SENDGRID_API_KEY;
console.log(secretKey);
// Set the secret key to the sendgrid
sendgrid.setApiKey(secretKey);

const msg = {
    to: 'dung1512002@gmail.com',
    from: 'dungminh1551@gmail.com',
    subject: 'Sending reset password token.',
    text: `Your reset token is 12345`
};

sendgrid.send(msg).then(res => {
    console.log('Email sent successfully!');
}).catch(err => {
    console.log("send mail error: ",err);
});
