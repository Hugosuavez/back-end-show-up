const db = require("../db/connection");

exports.insertUserMedia = (url, userId) => {
  const query = `INSERT INTO userMedia (url, user_id) VALUES ($1, $2) RETURNING *`;
  return db.query(query, [url, userId]).then((result) => result.rows[0]);
};
