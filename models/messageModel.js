const db = require("../db/connection");

exports.fetchAllMessages = () => {
  return db
    .query(`SELECT message_id, sender_id, recipient_id, sender_type, recipient_type, message, created_at FROM messages;`)
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchMessageById = (messageId) => {
  return db
    .query(`SELECT message_id, sender_id, recipient_id, sender_type, recipient_type, message, created_at FROM messages WHERE message_id = $1;`, [messageId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Message not found" });
      }
      return rows[0];
    });
};