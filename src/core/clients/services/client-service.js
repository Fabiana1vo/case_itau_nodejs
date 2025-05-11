const util = require('util');
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const { CustomError } = require('../../../commom/errors/custom-error')
const queryExecutor = require('../../../commom/database/query-executor')

 
 
exports.findAll = async () => {
    try {
        logger.info('Iniciando a busca de todos os clientes.')
        const query = 'SELECT * FROM clientes';

        /**
         * Represents the result set retrieved from the database query.
         * @type {Array<Object>}
         * @description An array of objects where each object represents a row from the database query result.
         */


        const rows = await queryExecutor.dbAllAsync(query, [])
        logger.info(`Consulta realizada com sucesso. Total de registros encontrados: ${rows.length}`);

        return rows
    } catch (error) {
        logger.error(`Ocorreu um erro durante a busca ${error.message}`)
        if(error.isOperational) {
            throw error
        }
        throw new CustomError('Erro ao buscar clientes', 500, 'SERVER_ERROR');
    }
}

/**
 * @async
 * @function exports.find
 * @description Busca cliente por ID.
 * @param {*} id - ID do cliente.
 * @returns {Promise<object|Array<object>>} Cliente encontrado.
 * @throws {CustomError} 400 ('ID necessário'), 404 ('Cliente não localizado'), 500 ('Erro ao buscar').
 */

exports.find = async (id) => { 
    try {

        logger.info(`Iniciando a busca do cliente de id: ${id} no banco de dados...`)
        
        const query = 'SELECT * FROM clientes WHERE id = ?';
        const result = await queryExecutor.dbGetAsync(query, [id])
       
        if(!result || result == undefined) {
            throw new CustomError('Cliente não localizado!', 404, 'NOT_FOUND')
        }

        logger.info(`Cliente ${id} localizado com sucesso!`)
        return result;

    } catch (error) {
        if(error.isOperational) {  
            throw error
        }

        throw new CustomError('Erro ao buscar cliente', 500, 'SERVER_ERROR');
    }
}

exports.create = async (nome, email) => {
        try {

         logger.info("Inciando o registro de um novo usuário")
         const existingUser = await queryExecutor.dbGetAsync(`SELECT email FROM clientes WHERE email = ?`, [email])
         logger.info("O usuário ainda não existe. Iniciando o processo de registro.")
       
         if(existingUser){
            throw new CustomError("Este e-mail já está em uso.", 400, 'BAD_REQUEST')
          }

        const query = `INSERT INTO clientes(nome, email, saldo) VALUES(?,?, 0)`;
        const result = await queryExecutor.dbRunWithLastID(query, [nome, email]);
         
         const insertedId = result && result.lastID !== undefined ? result.lastID : null;

        if (!insertedId) {
            throw new CustomError('Erro ao obter o ID do cliente criado.', 500, 'INSERT_ERROR');
        }

        logger.info(`Cliente ${insertedId}, ${nome}, criado com sucesso!`)
        return { id: insertedId, nome, email, saldo: 0 };

        } catch (error) {
            if(error.isOperational){
                throw error; 
            }
            throw new CustomError("Ocorreu um erro ao registar cliente. Tente novamente mais tarde!", 500, 'SERVER_ERROR')
        }
}


exports.update = async () => {
    try {
        //localizar o cliente
        //validar o campo
        //validar a entrada do campo
        //atualizar
        //retornar sucesso e dado atualizado 
    } catch (error) {
        
    }
}