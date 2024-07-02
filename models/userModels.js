const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db
    .query(
      `SELECT user_id, username, first_name, last_name, email, profile_img_url, user_type, category, location, entertainer_name, description, price FROM users;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchUserById = (userId) => {
  return db
    .query(
      `SELECT user_id, username, first_name, last_name, email, profile_img_url, user_type, category, location, entertainer_name, description, price FROM users WHERE user_id = $1;`,
      [userId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows[0];
    });
};
