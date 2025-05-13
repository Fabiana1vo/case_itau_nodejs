
/**
 * @function exports.integerToDecimal
 * @description Converts an integer value representing cents to a decimal string with two decimal places.
 * @param {number|string} value - The integer value in cents (e.g., 100 for 1.00).
 * @returns {string} The formatted decimal value as a string (e.g., '1.00').
 * @example
 * integerToDecimal(100); // Returns '1.00'
 */
exports.integerToDecimal = (value) => {
    const saldoCentavos = Number(value)
    return (saldoCentavos / 100).toFixed(2)
}


/**
 * @function exports.convertCurrencyToCents
 * @description Converts a decimal currency value to an integer representing cents, rounding to the nearest cent.
 * @param {number|string} value - The decimal currency value (e.g., 1.23).
 * @returns {number} The integer value in cents (e.g., 123).
 * @example
 * convertCurrencyToCents(1.23); // Returns 123
 */
exports.convertCurrencyToCents = (value) => {
     return Math.round(Number(value) * 100);
}

 