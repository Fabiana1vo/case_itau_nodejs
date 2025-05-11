const sqlite3 = require('sqlite3').verbose();
const logger = require('./src/config/logger')('DATABASE_CONFIG')
const { CustomError } = require('./src/commom/errors/custom-error');
 

/**
 * Initializes an in-memory SQLite database connection.
 * Logs an error message and throws a custom error if the connection fails.
 * Logs a success message upon successful connection.
 *
 * @constant {sqlite3.Database} db - The SQLite database instance.
 * @throws {CustomError} Throws a custom error with status code 500 if the connection fails.
 */

const db = new sqlite3.Database(':memory:', (error) => { 
    if(error) {
        logger.error(`Erro ao conectar ao banco de dados: ${error.message}`)
        throw new CustomError('Erro ao se conectar ao banco de dados', 500, 'SERVER_ERROR');
     } 
    logger.info('Conectado ao banco de dados SQLite em memória com sucesso!')
});


process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            logger.error(`Erro ao fechar o banco de dados: ${err.message}`);
        } else {
            logger.info('Conexão com o banco de dados encerrada.');
        }
        process.exit(0);
    });
});


module.exports = db;

