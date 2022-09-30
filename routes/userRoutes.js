const express = require('express');
const userController = require('./../controllers/userController');
const app = express();

const router = express.Router();

router.post('/login', userController.login);

module.exports = router;