require('dotenv').config()
const jwt = require('jsonwebtoken')

const secret_key = process.env.SECRET_KEY

exports.authUser = async (req, res) => {
 const user = { id: 1, username: 'user' }
    const token = jwt.sign(user, secret_key, {expiresIn: '1h'} )
    res.json({token})
}   


module.exports = {
    secret_key
}