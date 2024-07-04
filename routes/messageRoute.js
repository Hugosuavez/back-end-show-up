const express = require('express');
const { getConversations: getConversations, getConversationByUsername } = require('../controllers/messageController');
const { authenticateJWT } = require('../controllers/authController');

const router = express.Router();

router.get('/conversations', authenticateJWT, getConversations);
router.get('/conversations/:conversationsWith', authenticateJWT, getConversationByUsername);

module.exports = router;