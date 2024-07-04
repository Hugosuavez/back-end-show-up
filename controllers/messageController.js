const {
  fetchConversations,
  fetchConversationsWith,
  sendMessage
} = require("../models/messageModel");

exports.getConversations = (req, res, next) => {
  fetchConversations(req.user.id)
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch(next);
};

exports.getConversationByUsername = (req, res, next) => {
  const { conversationsWith } = req.params;
  const userId = req.user.id;
  fetchConversationsWith(conversationsWith, userId)
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch(next);
};

exports.postMessage = (req, res, next) => {
  const { recipientId, message } = req.body;
  const senderId = req.user.id;
  sendMessage(senderId, recipientId, message)
    .then((newMessage) => {
      res.status(201).send(newMessage);
    })
    .catch(next);
};
