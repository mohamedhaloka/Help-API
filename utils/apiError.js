class ApiError extends Error {

    constructor(statusCode, message) {
        super(message)
        this.status = `${statusCode}`.startsWith(5) ? "Server Error" : "Fail";
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ApiError;