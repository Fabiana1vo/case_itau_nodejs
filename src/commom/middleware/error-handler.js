const { CustomError } = require('../errors/custom-error');
const logger = require('../../config/logger')('ERROR_HANDLER');


function errorHandler(err, req, res, next) {
  if (err instanceof CustomError) {
    logger.error(`Erro personalizado: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      clientId: req.client?.clientId || 'não autenticado',
    });
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
    });
  }

  logger.error(`Ocorreu um erro inesperado. Entre em contato com o administrador do sistema.`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    clientId: req.client?.clientId || 'não autenticado',
  });
  
  res.status(500).json({
    statusCode: 500,
    message: 'Erro interno do servidor',
  });
}

module.exports = errorHandler;