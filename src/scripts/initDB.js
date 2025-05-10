const db = require('../../database');
const logger = require('../config/logger')('INIT_DATABASE');
const util = require('util');


const runAsync = util.promisify(db.run).bind(db);

exports.initDB = async () => {
    try {
        logger.info('Inicializando as tabelas do banco de dados.');

        // Criar tabela "clientes"
        await runAsync(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                saldo FLOAT
            )
        `);

        // Inserir cliente de teste
        const nomeTeste = 'TESTE';
        const emailTeste = 'TESTE@TESTE.com.br';

        await runAsync(
            `INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, 0)`,
            [nomeTeste, emailTeste]
        );

        logger.info('Tabelas inicializadas com sucesso.');
    } catch (error) {
        logger.error('Erro ao inicializar o banco de dados:', error);
    } finally {
        // db.close((err) => {
        //     if (err) {
        //         logger.error('Erro ao fechar a conexão com o banco de dados:', err);
        //     } else {
        //         logger.info('Conexão com o banco de dados fechada.');
        //     }
        // });
    }
};