const { CustomError } = require('../../../commom/errors/custom-error');
const { formatSuccessResponse } = require('../../../commom/utils/response-formatter')
const logger = require('../../../config/logger')('CLIENT_SERVICE');
const clientService = require('../services/client-service')
const clientValidations = require('../../../commom/validations/client-validations')


// Retorna todos os clientes da base de dados. 
// Retorna um array vazio caso não exista clientes
exports.getClients = async (req, res, next) => {
    try {
        const response = await clientService.findAll();
        res.status(200).json(formatSuccessResponse(response, 'Clientes localizados com sucesso!'))
    } catch (error) {
        next(error);
    }
}

//Captura um cliente pelo seu id no banco de dados.
exports.getClient = async (req, res, next ) => {
    try {
        const { id } = req.params; 

        if(!clientValidations.isNotUndefinedOrNullValue(id)) { 
            throw new CustomError("Você precisa informar o ID do cliente", 400, 'BAD_REQUEST')
        } 

        if(!clientValidations.isValidNumericId(id)) {
            throw new CustomError('Informe um ID válido', 400, 'BAD_REQUEST')
        }

        const response = await clientService.find(id)
        res.status(200).json(formatSuccessResponse(response,'Cliente localizado com sucesso!'))

    } catch (error) {
        next(error)
    }
}

exports.createClient = async (req,res,next) => { 
    try {
        logger.info('Iniciando a criação de um novo cliente')
        const { nome, email } = req.body; 

        if(!clientValidations.isNotUndefinedOrNullValue(email) || !clientValidations.isNotUndefinedOrNullValue(nome) ) {
            const errors = [];
            if (!nome) errors.push('nome');
            if (!email) errors.push('email');
            throw new CustomError(`Os campos: [${errors.join(', ')}] são obrigatórios!`, 400, 'BAD_REQUEST');
        }
        
        if(!clientValidations.isValidEmail(email)){ 
            logger.error('O e-mail informado náo é válido')
            throw new CustomError('Informe um e-mail válido!', 400, 'BAD_REQUEST')
        }

       const response = await clientService.create(nome, email)
       console.log(response, 'vendo a response')
        
         
        res.status(201).json(formatSuccessResponse(response,'Registro realizado com sucesso!'))

    } catch (error) {
        next(error);
    }
}





// router.post('/clientes', (req,res) => {
//     const {nome, email } = req.body;
//     try
//     {
//         db.run(`INSERT INTO clientes(nome, email) VALUES(?, ?)`, [nome, email]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })


//criar uma classe de validacao e deixar isso la 


