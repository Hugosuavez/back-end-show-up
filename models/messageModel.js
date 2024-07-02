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

exports.getConversations = (user_id) => {
  const query = `
    SELECT DISTINCT 
      u.user_id, u.username, u.first_name, u.last_name, u.email
    FROM users u
    INNER JOIN messages m ON u.user_id = m.sender_id OR u.user_id = m.recipient_id
    WHERE m.sender_id = $1 OR m.recipient_id = $1 AND u.user_id != $1;
  `;
  return db.query(query, [user_id]).then((result) => result.rows);
};

exports.getConversationMessages = (user_id, other_user_id) => {
  const query = `
    SELECT * FROM messages
    WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
    ORDER BY created_at DESC;
  `;
  return db
    .query(query, [user_id, other_user_id])
    .then((result) => result.rows);
};
