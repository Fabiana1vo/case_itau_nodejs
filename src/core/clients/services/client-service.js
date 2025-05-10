const db = require('../../../../database')
const util = require('util');
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const { CustomError } = require('../../../commom/errors/custom-error')
const dbAllAsync = util.promisify(db.all).bind(db)

exports.findAll = async () => {
    try {
        logger.info('Iniciando a busca de todos os clientes.')
        const query = ''
        if(!query) {
            throw new CustomError('Você precisa informar a query de consulta', 400, 'BAD_REQUEST')
        }
        const rows = await dbAllAsync(query, [])
        
        console.log(rows, 'estou logando os rows')
        return rows 
    } catch (error) {
        logger.error()
         throw new CustomError('Ocorreu um erro ao realizar a busca')
    }
}


//   router.get('/clientes', (req,res) => {
//     const query = 'SELECT * FROM clientes';
//     db.all(query, [], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })