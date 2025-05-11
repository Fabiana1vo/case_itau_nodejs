const express = require('express');
const router = express.Router();
const { getClients, getClient, createClient, updateClient, deleteClient } = require('../core/clients/controllers/client-controller')

// const authMiddleware = require('../common/middleware/authMiddleware');

// router.use(authMiddleware);

router.get('/', getClients);
router.get('/:id', getClient)
router.post('/', createClient);
router.put('/:id', updateClient)
router.delete('/:id',deleteClient);



module.exports = router;