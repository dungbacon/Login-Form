const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const globalErrorHandler = require('./controllers/ErrorController');
const userRouter = require('./routes/userRoutes');

mongoose.connect(process.env.DATABASE, {
    autoIndex: true,
}).then(() => {
    console.log('Connected to database');
});

const app = express();
app.use(express.json());
// Serving static files
app.use(express.static(`${__dirname}/assets`));

app.use(express.urlencoded({extended:true}));

app.use('/api/v1/users', userRouter);
// Error handling
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});