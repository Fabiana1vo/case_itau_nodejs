const express = require('express');
const router = express.Router();
const authLogin = require('../core/auth/controller/auth.controller')

/**
 * @route POST /login
 * @description Rota para autenticação de usuário. Recebe e-mail e nome, e retorna token JWT após validação.
 * @access Public
 */

router.post('/login', authLogin.authUser);   

module.exports = router;
