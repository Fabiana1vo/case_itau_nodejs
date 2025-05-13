const { CustomError } = require("../errors/custom-error");

/**
 * @function isValidNumericId
 * @description Checks if the provided ID is a valid numeric value using a regular expression.
 * @param {string|number} id - The ID to validate.
 * @returns {boolean} True if the ID is a valid numeric value, false otherwise.
 * @example
 * isValidNumericId('123'); // Returns true
 * isValidNumericId('abc'); // Returns false
 */

function isValidNumericId(id){
    if(!id){
        return false
    }
    const regex = /^[+-]?\d+(\.\d+)?$/;
    return  regex.test(id)
}

/**
 * @function isValidEmail
 * @description Validates if the provided email string matches a basic email format using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false if it is invalid, null, or undefined.
 * @example
 * isValidEmail('test@example.com'); // Returns true
 * isValidEmail('invalid-email'); // Returns false
 */

function isValidEmail(email) {
    if(!email || email == null || email == undefined ){
        return false
    
    
    }
    const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailPattern.test(email),'emailPattern.test(email)')
    return emailPattern.test(email)
}

/**
 * @function isNotUndefinedOrNullValue
 * @description Checks if a value is neither undefined nor null.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is neither undefined nor null, false otherwise.
 * @example
 * isNotUndefinedOrNullValue('test'); // Returns true
 * isNotUndefinedOrNullValue(null); // Returns false
 */
function isNotUndefinedOrNullValue(value) {
    return value !== undefined && value !== null;
}

/**
 * @function isValidCurrencyValue
 * @description Checks if a currency value is valid (not undefined, null, or falsy).
 * @param {*} value - The currency value to validate.
 * @returns {boolean} True if the value is defined and not null, false otherwise.
 * @example
 * isValidCurrencyValue(10.50); // Returns true
 * isValidCurrencyValue(null); // Returns false
 */

function isValidCurrencyValue (value) {
    if (!value) {
        return false;
    }
return value !== undefined || value !== null;
}

function assertPositiveValue(valor) {
  if (isNaN(valor) || valor <= 0) {
    throw new CustomError("Valor deve ser maior que zero", 400, "BAD_REQUEST");
  }
}


module.exports = {
    isValidNumericId,
    isValidEmail,
    isNotUndefinedOrNullValue,
    isValidCurrencyValue,
    assertPositiveValue
}