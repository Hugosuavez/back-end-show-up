const express = require('express');
const { getProfile } = require('../controllers/userController');
const { authenticateJWT } = require('../controllers/authController');

const router = express.Router();

router.get('/me', authenticateJWT, getProfile);

module.exports = router;