require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret_key = process.env.SECRET_KEY 

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];
    console.log(secret_key, 'secret_key');

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    const trimmedToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    try {
        const decoded = jwt.verify(trimmedToken, secret_key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }
}


module.exports = authToken;