const db = require("../db/connection");

const saveMessage = async (message) => {
  const {
    sender_id,
    recipient_id,
    sender_type,
    recipient_type,
    messageText,
    booking_id,
  } = message;
  const query = `
        INSERT INTO messages (sender_id, recipient_id, sender_type, recipient_type, message, booking_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
  const values = [
    sender_id,
    recipient_id,
    sender_type,
    recipient_type,
    messageText,
    booking_id,
  ];
  const res = await db.query(query, values);
  return res.rows[0];
};

module.exports = { saveMessage };
