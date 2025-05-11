const express = require('express');
const router = express.Router();
const clientesRoutes = require('./client.routes');
// const authRoutes = require('./auth.routes');

router.use('/clientes', clientesRoutes)



// router.use('/auth', authRoutes)
 

// const clienteRoutes = require('./clientes.routes');
// const authRoutes = require('./auth.routes');



// Registrar rotas com prefixos
// router.use('/clientes', clienteRoutes);
// router.use('/auth', authRoutes);

// Rota padrão para verificar se a API está funcionando
router.get('/', (req, res) => {
  console.log('na rota get pura')
  res.json({ message: 'API está funcionando' });
});


//* Implementado

//   router.get('/clientes', (req,res) => {
//     const query = 'SELECT * FROM clientes';
//     db.all(query, [], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })



// router.get('/clientes/:id', (req,res) => {
//     const {id} = req.params;
//     const query = 'SELECT * FROM clientes WHERE id = ?';
//     db.all(query, [id], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })


// router.post('/clientes', (req,res) => {
//     const {nome, email } = req.body;
//     try
//     {
//         db.run(`INSERT INTO clientes(nome, email) VALUES(?, ?)`, [nome, email]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })

// router.put('/clientes/:id', (req,res) => {
//     const { id } = req.params;
//     const {nome, email } = req.body;
//     try
//     {
//         db.run(`UPDATE clientes SET nome = ?, email = ? WHERE id = ?`, [nome, email, id]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })



// router.delete('/clientes/:id', (req,res) => {
//     const { id } = req.params;
//     try
//     {
//         db.run(`DELETE FROM clientes WHERE id = ?`, [id]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })


// router.post('/clientes/:id/depositar', (req,res) => {
//     const { id } = req.params;
//     const { valor } = req.body;
//     console.log({id, valor});
//     try
//     {
//         db.run(`UPDATE clientes SET saldo = saldo + ? WHERE id = ?`, [valor, id]);
//         return res.status(200).json();
//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })


//*********************************** */






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