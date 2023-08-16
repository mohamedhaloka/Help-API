


const globalErrorMiddleware = (err, req, res, next) => {

    console.log(err.message);
    res.status(err.statusCode || 500).json({
        status: err.status || 'Fail',
        message: err.message || "Error occurred while processing request",
        stack: err.stack
    })
}

module.exports = globalErrorMiddleware;