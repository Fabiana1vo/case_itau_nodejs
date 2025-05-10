const clientService = require('../services/client-service')


exports.getClients = async (req, res, next) => {
    try {
        console.log('tentando capturar os clientes')
        const response = await clientService.findAll();
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}

//   router.get('/clientes', (req,res) => {
//     const query = 'SELECT * FROM clientes';
//     db.all(query, [], (err,rows) => {
//         if (err) 
//             return res.status(400).json({error: err.message});
//         return res.json(rows);
//     })
// })