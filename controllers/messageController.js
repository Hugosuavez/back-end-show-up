const { fetchAllMessages, fetchMessageById } = require("../models/messageModel");

exports.getAllMessages = (req, res, next) => {
  fetchAllMessages()
    .then((messages) => {
      res.status(200).send({ messages });
    })
    .catch(next);
};

exports.getMessageById = (req, res, next) => {
  const { messageId } = req.params;
  fetchMessageById(messageId)
    .then((message) => {
      res.status(200).send({ message });
    })
    .catch(next);
};