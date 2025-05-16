
/**
 * @function exports.convertCurrencyIntegerToDecimal
 * @description Converts an integer value representing cents to a decimal string with two decimal places.
 * @param {number|string} value - The integer value in cents (e.g., 100 for 1.00).
 * @returns {string} The formatted decimal value as a string (e.g., '1.00').
 * @example
 * convertCurrencyIntegerToDecimal(100); // Returns '1.00'
 */
exports.convertCurrencyIntegerToDecimal = (value) => {
    const saldoCentavosParaInteiro = Number(value)
    return (saldoCentavosParaInteiro / 100).toFixed(2)
}


/**
 * @function exports.convertCurrencyToInteger
 * @description Converts a decimal currency value to an integer representing cents, rounding to the nearest cent.
 * @param {number|string} value - The decimal currency value (e.g., 1.23).
 * @returns {number} The integer value in cents (e.g., 123).
 * @example
 * convertCurrencyToInteger(1.23); // Returns 123
 */
exports.convertCurrencyToInteger = (value) => {
     return Math.round(Number(value) * 100);
}

 