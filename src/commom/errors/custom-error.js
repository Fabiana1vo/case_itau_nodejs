class CustomError extends Error { 
    constructor(message, status_code, code) {
        super(message);
        this.isOperational = true
        this.name = 'CustomError';
        this.statusCode = status_code  || 500;
        this.code = code || ''
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { CustomError };

