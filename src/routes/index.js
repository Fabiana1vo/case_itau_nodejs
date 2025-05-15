const express = require('express');
const router = express.Router();
const clientesRoutes = require('./client.routes');
const authRoutes = require('./auth.routes');

/**
 * @function router.use
 * @description Mounts the clientesRoutes middleware for handling client-related routes under the '/clientes' path.
 * @param {string} path - The base path for client routes ('/clientes').
 * @param {object} clientesRoutes - The Express router containing client-related route handlers.
 * @example
 * router.use('/clientes', clientesRoutes); // All client routes are prefixed with '/clientes'
 */
router.use('/auth', authRoutes)
router.use('/clientes', clientesRoutes)

//* Implementar a auth routes aqui

router.get('/', (req, res) => {
  res.json({ message: 'API está funcionando' });
});



module.exports = router;