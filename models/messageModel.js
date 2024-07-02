const db = require("../db/connection");

exports.sendMessage = (sender_id, recipient_id, message) => {
  const query = `
    INSERT INTO messages (sender_id, recipient_id, message)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return db
    .query(query, [sender_id, recipient_id, message])
    .then((result) => result.rows[0]);
};

exports.getMessages = (user_id) => {
  const query = `
    SELECT * FROM messages
    WHERE sender_id = $1 OR recipient_id = $1
    ORDER BY created_at DESC;
  `;
  return db.query(query, [user_id]).then((result) => result.rows);
};
