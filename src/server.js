const express = require('express');
const routes = require('./routes')
const cors = require('cors')
const errorHandler = require('./commom/middleware/error-handler')
const {initDB} = require('./scripts/initDB');
const logger = require('./config/logger')('SERVER')
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/v1', routes)
app.use(errorHandler); 



const PORT = process.env.PORT || 3000;

initDB()
.then(() => {
    app.listen(PORT, () => {
        logger.info(`Servidor rodando na porta ${PORT}`)
    });
})
.catch((err) => {
    logger.error(`Erro ao iniciar o servidor:', ${err.message}`)
    process.exit(1);
});



