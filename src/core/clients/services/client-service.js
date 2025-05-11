const db = require('../../../../database')
const util = require('util');
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const { CustomError } = require('../../../commom/errors/custom-error')

const dbAllAsync = util.promisify(db.all).bind(db)

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




//  router.get('/clientes', (req,res) => {
//     const query = 'SELECT * FROM clientes';
//     db.all(query, [], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })