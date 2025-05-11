const express = require('express');
const router = express.Router();
const { getClients, getClient, createClient, updateClient, deleteClient, deposit, withdraw } = require('../core/clients/controllers/client-controller')

// const authMiddleware = require('../common/middleware/authMiddleware');

// router.use(authMiddleware);

router.get('/', getClients);
router.get('/:id', getClient)
router.post('/', createClient);
router.put('/:id', updateClient)
router.delete('/:id',deleteClient);
router.post('/:id/depositar', deposit);
router.post('/:id/sacar', withdraw);


// router.post('/clientes/:id/sacar', (req,res) => {
//     const { id } = req.params;
//     const { valor } = req.body;
//     console.log({id, valor});
//     try
//     {
//         db.run(`UPDATE clientes SET saldo = saldo - ? WHERE id = ?`, [valor, id]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })



module.exports = router;
