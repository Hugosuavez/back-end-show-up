const { sendMessage, getMessages } = require("../models/messageModel");
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

exports.getMessages = async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const messages = await getMessages(user_id);
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
