const { CustomError } = require('../errors/custom-error');
const logger = require('../../config/logger')('ERROR_HANDLER');


function errorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();
  if (err instanceof CustomError) {
    console.log(err,'vendo o erro que chegou no middleware')
    logger.error(`Erro personalizado: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      clientId: req.client?.clientId || 'não autenticado',
      timestamp

    });
    return res.status(err.statusCode).json({
      status: err.statusCode,
      error : {
        code: err.code,
        message: err.message,
        timestamp
      },
     });
  }

  logger.error(`Ocorreu um erro inesperado. Entre em contato com o administrador do sistema.`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    clientId: req.client?.clientId || 'não autenticado',
    timestamp
  });
  
  res.status(500).json({
    statusCode: 500,
        error : {
        message: 'Erro interno do servidor',
        code: 'SERVER_ERROR',
        timestamp
      },
 
  });
}

module.exports = errorHandler;