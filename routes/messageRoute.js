const express = require('express');
const { sendMessage, getConversations, getConversationMessages } = require('../controllers/messageController');
const { authenticateJWT } = require('../controllers/authController');

const router = express.Router();

router.post('/messages', authenticateJWT, sendMessage);
router.get('/conversations', authenticateJWT, getConversations);
router.get('/messages/:username', authenticateJWT, getConversationMessages);

module.exports = router;