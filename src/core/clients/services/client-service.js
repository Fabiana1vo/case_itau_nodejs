const logger = require('../../../config/logger')('CLIENT_SERVICE');
const { CustomError } = require('../../../commom/errors/custom-error')
const queryExecutor = require('../../../commom/database/query-executor')
const { integerToDecimal, convertCurrencyToCents} = require('../../../commom/utils/currency-formatter')
 

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
       
         if(existingUser){
            throw new CustomError("Este e-mail já está em uso.", 400, 'BAD_REQUEST')
          }
          
        
        logger.info("O usuário ainda não existe. Iniciando o processo de registro.")

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

exports.update = async (id, nome, email) => {
    try {
        const fieldsToUpdate = [];
        const values = [];

        if (nome) {
            fieldsToUpdate.push('nome = ?');
            values.push(nome);
        }

        if (email) {
            fieldsToUpdate.push('email = ?');
            values.push(email);
        }

        const query = `UPDATE clientes SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
        values.push(id);

        const result = await queryExecutor.dbRunWithLastID(query, values);

        if (result.changes === 0) {
            throw new CustomError('Cliente não encontrado ou nenhum dado foi alterado.', 404, 'NOT_FOUND');
        }

        logger.info(`Cliente ${id} atualizado com sucesso!`);

        return { id, ...(nome && { nome }), ...(email && { email }) };
    } catch (error) {
        if(error.isOperational){
            throw error;
        }
        throw new CustomError('Ocorreu um erro ao atualizar os dados. Tente novamente mais tarde', 500,' SERVER_ERROR')
    }
}

exports.delete = async (id) => {
    try {

        logger.info(`Iniciando o processo de exclusão da conta: ${id}`)
        let query = `SELECT saldo FROM clientes WHERE id = ?`;
       
        const saldo = await queryExecutor.dbGetAsync(query,[id])

        if(!saldo){
            throw  new CustomError("Cliente não localizado", 400, 'BAD_REQUEST') 
        }

        if(saldo > 0){
            throw new CustomError("Você precisa sacar todo o saldo da sua conta antes de solicitar a exclusão", 400, 'BAD_REQUEST')
        }

        
        query = `DELETE FROM clientes WHERE id = ?`
         await queryExecutor.dbRunAsync(query,[id])
        logger.info(`Cliente ${id} deletado com sucesso!`)
        return 
    } catch (error) {
      
        if(error.isOperational){
            throw error;
        }
        throw new CustomError('Ocorreu um erro excluir sua conta. Tente novamente mais tarde', 500,' SERVER_ERROR')
    }               
     
}

exports.deposit = async (id, valor) => {
    try {
        logger.info(`Iniciando a adição de saldo para conta: ${id}`);

        if (isNaN(valor) || valor === null || valor === undefined) {
            throw new CustomError("Valor inválido", 400, 'BAD_REQUEST');
        }

        // Converter o valor para centavos
        const valorCentavos = convertCurrencyToCents(valor)

        if (valorCentavos <= 0) {
            throw new CustomError("O valor do depósito deve ser maior que zero", 400, 'BAD_REQUEST');
        }

        let query = `UPDATE clientes SET saldo = saldo + ? WHERE id = ?`;
        const response = await queryExecutor.dbRunWithLastID(query, [valorCentavos, id]);

        if (!response || !response.changes) {
            throw new CustomError("Ocorreu um erro ao tentar adicionar o saldo na sua conta. Tente novamente mais tarde", 500, 'SERVER_ERROR');
        }

        // Buscar o saldo atualizado em centavos
        query = `SELECT saldo FROM clientes WHERE id = ?`;
        const result = await queryExecutor.dbGetAsync(query, [id]);
 
        logger.info(`Saldo adicionado com sucesso. O saldo atual é de: ${result.saldo}`);

        return { saldo: result.saldo }; // Retorna o saldo formatado
    } catch (error) {
        if (error.isOperational) {
            throw error;
        }
        throw new CustomError('Ocorreu um erro ao adicionar o saldo na sua conta. Tente novamente mais tarde', 500, 'SERVER_ERROR');
    }
};


exports.withdraw = async (id, valor) => {
    try {
        logger.info(`Iniciando o saque de saldo para conta: ${id}`);

        if (isNaN(valor) || valor === null || valor === undefined) {
            throw new CustomError("Valor inválido", 400, 'BAD_REQUEST');
        }

        // Converter o valor para centavos
        const valorCentavos = convertCurrencyToCents(valor)

        if (valorCentavos <= 0) {
            throw new CustomError("O valor do saque deve ser maior que zero", 400, 'BAD_REQUEST');
        }

        let query = `SELECT saldo FROM clientes WHERE id = ?`;
        const result = await queryExecutor.dbGetAsync(query, [id]);
        if (!result) {
            throw new CustomError("Conta não encontrada", 404, 'NOT_FOUND');
        }

        const saldoCentavos = Math.round(Number(result.saldo));
        if (saldoCentavos < valorCentavos) {
            throw new CustomError(`Saldo insuficiente para o saque. O saldo atual é de: R$ ${integerToDecimal(saldoCentavos)}`, 400, 'BAD_REQUEST');
        }
         
 
        query = `UPDATE clientes SET saldo = saldo - ? WHERE id = ?`;
        const response = await queryExecutor.dbRunWithLastID(query, [valorCentavos, id]);

        if (!response || !response.changes) {
            throw new CustomError("Erro ao realizar o saque. Tente novamente mais tarde", 500, 'SERVER_ERROR');
        }

        query = `SELECT saldo FROM clientes WHERE id = ?`;
        const novoResult = await queryExecutor.dbGetAsync(query, [id]);
        
        return { saldo: novoResult.saldo }; // Retorna o saldo formatado
    } catch (error) {
        if (error.isOperational) {
            throw error;
        }
        throw new CustomError('Ocorreu um erro ao adicionar o saldo na sua conta. Tente novamente mais tarde', 500, 'SERVER_ERROR');
    }
};




// router.post('/clientes/:id/sacar', (req,res) => {
//     const { id } = req.params;
//     const { valor } = req.body;
//     console.log({id, valor});
//     try
//     {
//         db.run(`UPDATE clientes SET saldo = saldo - ? WHERE id = ?`, [valor, id]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })