/**
 * @class CustomError
 * @description Custom error class for handling operational errors with specific status codes and error codes.
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} [status_code=500] - HTTP status code for the error.
 * @param {string} [code=''] - Custom error code identifier.
 * @property {boolean} isOperational - Indicates if the error is operational (always true).
 * @property {string} name - Name of the error class ('CustomError').
 * @property {number} statusCode - HTTP status code associated with the error.
 * @property {string} code - Custom error code.
 * @example
 * throw new CustomError('Invalid ID', 400, 'BAD_REQUEST');
 */
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

