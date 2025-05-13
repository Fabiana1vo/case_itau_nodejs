const express = require('express');
const router = express.Router();

// const authMiddleware = require('../common/middleware/authMiddleware');

// router.use(authMiddleware);

router.post('/login', authLogin);   

module.exports = router;
