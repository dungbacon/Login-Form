const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./utils/passport');
const session = require('express-session');
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


app.use(express.static(`${__dirname}/assets`));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    cookie: {
        expires: 1000 * 60 * 60 * 24 * 30,
        secure: true,
        httpOnly: true,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
// Serving static files


app.use('/', userRouter);
// Error handling
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});