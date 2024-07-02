const {
  sendMessage,
  getConversations,
  getConversationMessages,
} = require("../models/messageModel");
const { getUserByUsername } = require("../models/usersModel");

exports.sendMessage = async (req, res, next) => {
  const { recipient, message } = req.body;
  const sender_id = req.user.id;

  if (!recipient || !message) {
    return res
      .status(400)
      .send({ error: "Recipient and message are required" });
  }

  try {
    const recipientUser = await getUserByUsername(recipient);

    if (!recipientUser) {
      return res.status(404).send({ error: "Recipient not found" });
    }

    const newMessage = await sendMessage(
      sender_id,
      recipientUser.user_id,
      message
    );
    res.status(201).send(newMessage);
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const conversations = await getConversations(user_id);
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};

exports.getConversationMessages = async (req, res, next) => {
  const user_id = req.user.id;
  const { username } = req.params;

  try {
    const otherUser = await getUserByUsername(username);

    if (!otherUser) {
      return res.status(404).send({ error: "User not found" });
    }

    const messages = await getConversationMessages(user_id, otherUser.user_id);
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
