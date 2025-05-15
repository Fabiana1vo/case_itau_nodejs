const logger = require('../config/logger')('INIT_DATABASE');
const queryExecutor = require('../commom/database/query-executor')

 /**
 * @async
 * @function exports.initDB
 * @description Initializes the database by creating the 'clientes' table and inserting a test client.
 * @returns {Promise<void>} Resolves when the database is initialized.
 * @throws {Error} Logs and handles errors during database initialization.
 */

exports.initDB = async () => {
    try {
        logger.info('Inicializando as tabelas do banco de dados.');

        // Criar tabela "clientes"
        await queryExecutor.dbRunAsync(`
            CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            saldo REAL
            )
        `);

        // Inserir cliente de teste - sem crypto
        const nomeTeste = 'TESTE';
        const emailTeste = 'TESTE@TESTE.com.br';

        await queryExecutor.dbRunAsync(
            `INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, 0)`,
            [nomeTeste, emailTeste]
        );

        logger.info('Tabelas inicializadas com sucesso.');
    } catch (error) {
        logger.error('Erro ao inicializar o banco de dados:', error);
    }
};

