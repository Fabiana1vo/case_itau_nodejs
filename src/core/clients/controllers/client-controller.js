const { CustomError } = require('../../../commom/errors/custom-error');
const { formatSuccessResponse } = require('../../../commom/utils/response-formatter')
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const clientService = require('../services/client-service')


exports.getClients = async (req, res, next) => {
    try {
        console.log('tentando capturar os clientes')
        const response = await clientService.findAll();
        res.status(200).json(formatSuccessResponse(response, 'Clients retrieved successfully'))
    } catch (error) {
        next(error);
    }
}


exports.getClient = async (req, res, next ) => {
    try {
        const { id } = req.params.id; 

        if(!id) { 
            logger.error("Id não informado!")
            throw new CustomError("Você precisa informar o ID do cliente", 400, 'BAD_REQUEST')
        } 

        const response = await clientService.findClient(id)
        res.status(200).json({
            success: true,
            message: 'Client retrieved successfully',
            data: { 
            ...response
            }
        });

    } catch (error) {
        next(error)
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