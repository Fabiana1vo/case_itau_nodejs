const express = require('express');
const router = express.Router();


router.post('/login', authLogin);   

module.exports = router;
