const sqlite3 = require('sqlite3').verbose();
const logger = require('./src/config/logger')('DATABASE_CONFIG')
const { CustomError } = require('./src/commom/errors/custom-error');
 

const db = new sqlite3.Database(':memory:', (error) => { 
    if(error) {
        logger.error(`Erro ao conectar ao banco de dados: ${error.message}`)
        throw new CustomError('Erro ao se conectar ao banco de dados', 400);
     } 
    logger.info('Conectado ao banco de dados SQLite em memória com sucesso!')
});

module.exports = db;

