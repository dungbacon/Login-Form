const sendErrorDev = (err, res) => {
    res.status(err.statusCode).send({
        message: err.message,
        error: err,
        statusCode: err.statusCode,
        stack: err.stack
    });
};

module.exports = ((err, req, res, next) => {
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }
});