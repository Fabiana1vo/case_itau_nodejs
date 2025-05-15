require('dotenv').config()
const jwt = require('jsonwebtoken')
const clientRepository = require('../../clients/repository/client-repository')
const { CustomError } = require("../../../commom/errors/custom-error");
const logger = require("../../../config/logger")("AUTH_SERVICE");
const secret_key = process.env.SECRET_KEY
const Crypto = require('../../../commom/utils/encryption')
exports.authUser = async (email, nome) => {
const clientExists = await clientRepository.dbGetByEmail(email)
console.log(clientExists,'clientExists')

if(!clientExists){
    throw new CustomError('E-mail não localizado. Verifique e tente novamente!', 404, 'NOT_FOUND')
}

const decryptName = Crypto.decrypt(clientExists.nome) 
const token = generateAuthToken(decryptName,clientExists.id)

    return { 
        token,
            ...clientExists,
            nome: decryptName
    }
}   


function generateAuthToken(username, id){
   const user = { id: 1, username }
   const token = jwt.sign(user, secret_key, {expiresIn: '1h'} )
   return token;
}

