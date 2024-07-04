const express = require("express");
const {
  getConversations,
  getConversationByUsername,
  postMessage
} = require("../controllers/messageController");
const { authenticateJWT } = require("../controllers/authController");

const router = express.Router();

router.get("/conversations", authenticateJWT, getConversations);
router.get(
  "/conversations/:conversationsWith",
  authenticateJWT,
  getConversationByUsername
);
router.post("/conversations", authenticateJWT, postMessage);

module.exports = router;
