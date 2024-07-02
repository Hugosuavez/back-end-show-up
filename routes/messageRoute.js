const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { authenticateJWT } = require('../controllers/authController');

const router = express.Router();

router.post('/messages', authenticateJWT, sendMessage);
router.get('/messages', authenticateJWT, getMessages);

module.exports = router;