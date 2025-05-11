const { CustomError } = require('../../../commom/errors/custom-error');
const { formatSuccessResponse } = require('../../../commom/utils/response-formatter')
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const clientService = require('../services/client-service')


exports.getClients = async (req, res, next) => {
    try {
        console.log('tentando capturar os clientes')
        const response = await clientService.findAll();
        res.status(200).json(formatSuccessResponse(response, 'Clientes localizados com sucesso!'))
    } catch (error) {
        next(error);
    }
}


exports.getClient = async (req, res, next ) => {
    try {
        const { id } = req.params; 

        if(!id) { 
            logger.error("Id não informado!")
            throw new CustomError("Você precisa informar o ID do cliente", 400, 'BAD_REQUEST')
        } 

        const response = await clientService.find(id)
        res.status(200).json(formatSuccessResponse(response,'Cliente localizado com sucesso!'))


    } catch (error) {
        next(error)
    }
}


// router.get('/clientes/:id', (req,res) => {
//     const {id} = req.params;
//     const query = 'SELECT * FROM clientes WHERE id = ?';
//     db.all(query, [id], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })
