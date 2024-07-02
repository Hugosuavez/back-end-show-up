const db = require("../db/connection");

exports.getUserByUsername = (username) => {
  const query = "SELECT * FROM users WHERE username = $1 OR email = $1;";
  return db.query(query, [username]).then((result) => result.rows[0]);
};
