const formatSuccessResponse = (data, message = 'Operacao realizada com sucesso') => {
    return { 
        success:true, 
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

module.exports = { formatSuccessResponse};