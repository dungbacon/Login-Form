const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

const globalErrorHandler = require('./controllers/ErrorController');
const userRouter = require('./routes/userRoutes');

mongoose.connect(process.env.DATABASE, {
    autoIndex: true,
}).then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log(err.message);
    process.exit(1);
});

const app = express();

app.use(express.json());
// Serving static files
app.use(express.static(`${__dirname}/assets`));

app.use(express.urlencoded({ extended: true }));

app.use('/', userRouter);
// Error handling
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});