const {
  fetchConversations,
  fetchMessageById,
} = require("../models/messageModel");

exports.getConversations = (req, res, next) => {
  fetchConversations(req.user.id)
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch(next);
};

exports.getMessageById = (req, res, next) => {
  const { messageId } = req.params;
  fetchMessageById(messageId)
    .then((message) => {
      res.status(200).send(message);
    })
    .catch(next);
};
