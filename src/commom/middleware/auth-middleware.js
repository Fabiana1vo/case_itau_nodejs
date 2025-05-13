const jwt = require('jsonwebtoken');
require('dotenv').config();
const { secret_key } = require('../../core/auth/service/auth.service')

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
            return res.status(401).json({
            message: 'Access denied. No token provided.'
        });   
     }

     //Bearer identifica que o token é um token de autenticação / deve ser enviado no header da requisição

        const trimmedToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const decoded = jwt.verify(trimmedToken, secret_key);

        req.user = decoded;
 
    console.log(token)
    next()
}

module.exports = authToken;