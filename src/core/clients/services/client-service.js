const db = require('../../../../database')
const util = require('util');
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const { CustomError } = require('../../../commom/errors/custom-error')


// poderia separar isso em um arquivo mas criaria uma complexidade maior para este cenário simples
const dbAllAsync = util.promisify(db.all).bind(db);
const dbGetAsync = util.promisify(db.get).bind(db);
const dbRunAsync = util.promisify(db.run).bind(db);
const dbExecAsync = util.promisify(db.exec).bind(db);

exports.findAll = async () => {
    try {
        logger.info('Iniciando a busca de todos os clientes.')
        const query = 'SELECT * FROM clientes';

        /**
         * Represents the result set retrieved from the database query.
         * @type {Array<Object>}
         * @description An array of objects where each object represents a row from the database query result.
         */


        const rows = await dbAllAsync(query, [])
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



exports.find = async (id) => { 
    try {
        if(!id){
            throw new CustomError('É necessário informar o Id', 400, 'BAD_REQUEST')
        }

        const query = 'SELECT * FROM clientes WHERE id = ?';
        const result = await dbAllAsync(query, [id])
        console.log(result,'result')
       
        if(!result || result.length < 1) {
            throw new CustomError('Cliente não localizado!', 404, 'NOT_FOUND')
        }

        return result;

    } catch (error) {
    
        logger.error(`Ocorreu um erro durante a busca ${error.message}`)

        console.log(error,'error')
        if(error.isOperational) {  
            console.log('é u')  
            throw error
        }

        throw new CustomError('Erro ao buscar cliente', 500, 'SERVER_ERROR');
    }
}


//  router.get('/clientes', (req,res) => {
//     const query = 'SELECT * FROM clientes';
//     db.all(query, [], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })