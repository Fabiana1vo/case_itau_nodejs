const db = require('../../database')
const express = require('express');
const router = express.Router();
const { getClients } = require('../core/clients/controllers/client-controller')

// const authMiddleware = require('../common/middleware/authMiddleware');

// router.use(authMiddleware);

router.get('/', getClients);


// router.post('/', clientController.createClient);
// router.put('/:id', clientController.updateClient);
// router.delete('/:id', clientController.deleteClient);

module.exports = router;