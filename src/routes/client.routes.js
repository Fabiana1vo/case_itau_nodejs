const express = require('express');
const router = express.Router();
const { getClients, getClient, createClient, updateClient, deleteClient, deposit, withdraw } = require('../core/clients/controllers/client-controller')
// const authMiddleware = require('../common/middleware/authMiddleware');

// router.use(authMiddleware);

/**
 * @module clientesRoutes
 * @description Defines Express routes for client-related operations, including retrieving, creating, updating, deleting clients, and handling deposits and withdrawals.
 * @requires express
 * @requires ../core/clients/controllers/client-controller
 * @example
 * const router = require('./clientesRoutes');
 * router.use('/clientes', router); // Mounts client routes under '/clientes'
 */

router.get('/', getClients);
router.get('/:id', getClient)
router.post('/', createClient);
router.put('/:id', updateClient)
router.delete('/:id',deleteClient);
router.post('/:id/depositar', deposit);
router.post('/:id/sacar', withdraw);


module.exports = router;
