const currencyFormatter = require('./currency-formatter')
const formatSuccessResponse = (data, message = 'Operacao realizada com sucesso') => {
       
    const formatData = Array.isArray(data)  ? data.map(item => ({
        ...item, saldo: item.saldo ? currencyFormatter.integerToDecimal(item.saldo) : item.saldo })) : {...data, saldo: data.saldo ? currencyFormatter.integerToDecimal(data.saldo) : data.saldo }
    
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