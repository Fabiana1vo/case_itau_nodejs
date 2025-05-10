class CustomError extends Error { 
    constructor(message, status_code) {
        super(message);
        this.name = 'CustomError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);

    }
}

module.exports = { CustomError };

