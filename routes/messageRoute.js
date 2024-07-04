const express = require('express');
const { getConversations: getConversations, getMessageById } = require('../controllers/messageController');
const { authenticateJWT } = require('../controllers/authController');

const router = express.Router();

router.get('/conversations', authenticateJWT, getConversations);
router.get('/messages/:messageId', authenticateJWT, getMessageById);

module.exports = router;