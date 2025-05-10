class CustomError extends Error { 
    constructor(message, status_code, code) {
        super(message);
        this.name = 'CustomError';
        this.code = code;
        this.statusCode = status_code;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { CustomError };

