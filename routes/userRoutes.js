const express = require('express');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');

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
})
router.post('/login', userController.login);

module.exports = router;