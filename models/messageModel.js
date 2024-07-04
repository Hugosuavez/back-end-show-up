const db = require("../db/connection");

exports.fetchConversations = (userId) => {
  return db
    .query(
      `
      SELECT DISTINCT ON (m.recipient_id)
        u2.username,
        u2.first_name,
        u2.last_name,
        u2.profile_img_url
      FROM 
        messages m
      JOIN 
        users u1 ON m.sender_id = u1.user_id
      JOIN 
        users u2 ON m.recipient_id = u2.user_id
      WHERE 
        m.sender_id = $1 OR m.recipient_id = $1;
    `,
      [userId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchConversationsWith = (conversationsWithUsername, userId) => {
  return db
    .query(`
      SELECT 
        m.message_id, 
        m.sender_id, 
        u1.username AS sender_username, 
        m.recipient_id, 
        u2.username AS recipient_username, 
        m.message, 
        m.created_at 
      FROM 
        messages m
      JOIN 
        users u1 ON m.sender_id = u1.user_id
      JOIN 
        users u2 ON m.recipient_id = u2.user_id
      WHERE 
        (u1.username = $1 AND m.recipient_id = $2)
        OR (u2.username = $1 AND m.sender_id = $2)
      ORDER BY 
        m.message_id ASC;
    `, [conversationsWithUsername, userId])
    .then(({ rows }) => {
      return rows;
    });
};
