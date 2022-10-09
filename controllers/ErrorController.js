const sendErrorDev = (err, res) => {
    res.status(err.statusCode).send({
        message: err.message,
        error: err,
        statusCode: err.statusCode,
        stack: err.stack
    });
};

module.exports = ((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }
});