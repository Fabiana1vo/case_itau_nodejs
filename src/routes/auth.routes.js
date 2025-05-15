const express = require('express');
const router = express.Router();
const authLogin = require('../core/auth/controller/auth.controller')

router.post('/login', authLogin.authUser);   

module.exports = router;
