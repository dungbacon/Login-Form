const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');
dotenv.config({ path: './config.env' });

const app = express();

const port = process.env.PORT || 3000;

app.use('/api/v1/users', userRouter);


const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});