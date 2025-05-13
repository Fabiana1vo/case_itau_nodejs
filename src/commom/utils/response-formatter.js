const currencyFormatter = require('./currency-formatter')
const Crypto = require('../../commom/utils/encryption')

/**
 * @function formatSuccessResponse
 * @description Formats a successful API response, converting saldo values to decimal format using currencyFormatter.
 * @param {object|Array<object>} data - The data to be included in the response, either a single object or an array of objects.
 * @param {string} [message='Operacao realizada com sucesso'] - Custom success message for the response.
 * @returns {object} Formatted response object containing success status, message, formatted data, and timestamp.
 * @example
 * const response = formatSuccessResponse({ id: 1, saldo: 1000 }, 'Operation completed');
 * Returns: { success: true, message: 'Operation completed', data: { id: 1, saldo: '10.00' }, timestamp: '2025-05-11T12:34:56.789Z' }
 */

const formatSuccessResponse = (data, message = 'Operacao realizada com sucesso') => {
    const formatData = Array.isArray(data)  ? data.map(item => ({ ...item, nome: Crypto.decrypt(item.nome) , saldo: item.saldo ? currencyFormatter.integerToDecimal(item.saldo) : item.saldo })) : {...data, nome: Crypto.decrypt(data.nome), saldo: data.saldo ? currencyFormatter.integerToDecimal(data.saldo) : data.saldo }
    
    if(data && data.saldo){
        console.log(data,'identifiquei q tem saldo na response vou formatar')
    }
    return { 
        success:true, 
        message,
        data:formatData,
        timestamp: new Date().toISOString()
    };
};

module.exports = { formatSuccessResponse};