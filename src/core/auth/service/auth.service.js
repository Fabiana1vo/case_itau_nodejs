require('dotenv').config()
const jwt = require('jsonwebtoken')
const clientRepository = require('../../clients/repository/client-repository')
const { CustomError } = require("../../../commom/errors/custom-error");
const logger = require("../../../config/logger")("AUTH_SERVICE");
const secret_key = process.env.SECRET_KEY
const Crypto = require('../../../commom/utils/encryption')


/**
 * @async
 * @function exports.authUser
 * @description Autentica um usuário pelo e-mail, verifica existência, descriptografa o nome e gera um token JWT válido por 1 hora.
 * @param {string} email - E-mail do usuário.
 * @param {string} nome - Nome do usuário (para log).
 * @returns {Promise<object>} Objeto contendo o token JWT de autenticação.
 * @throws {CustomError} 404 ('E-mail não localizado. Verifique e tente novamente!').
 */

exports.authUser = async (email, nome) => {
const clientExists = await clientRepository.dbGetByEmail(email)
logger.info(`Inciando a busca do cliente de e-mail: ${email} - (${nome}) no banco de dados`)
if(!clientExists){
    throw new CustomError('E-mail não localizado. Verifique e tente novamente!', 404, 'NOT_FOUND')
}
const decryptedName = Crypto.decrypt(clientExists.nome) 
const token = generateAuthToken(decryptedName,clientExists.id)
return { token }
}   

//* Helpers 

function generateAuthToken(username, id){
   const user = { id: id, username }
   const token = jwt.sign(user, secret_key, {expiresIn: '1h'} )
   return token;
}

