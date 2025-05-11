const express = require('express');
const router = express.Router();
const { getClients, getClient, createClient, updateClient } = require('../core/clients/controllers/client-controller')

// const authMiddleware = require('../common/middleware/authMiddleware');

// router.use(authMiddleware);

router.get('/', getClients);
router.get('/:id', getClient)
router.post('/', createClient);
router.put('/:id', updateClient)


// router.put('/:id', clientController.updateClient);
// router.delete('/:id', clientController.deleteClient);

module.exports = router;