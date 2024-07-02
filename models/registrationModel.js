const db = require("../db/connection");

exports.addUser = (user) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    user_type,
    category,
    location,
    entertainer_name,
    description,
    price,
  } = user;

  const query = `
    INSERT INTO users (username, password, first_name, last_name, email, user_type, category, location, entertainer_name, description, price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  return db
    .query(query, [
      username,
      password,
      first_name,
      last_name,
      email,
      user_type,
      category,
      location,
      entertainer_name,
      description,
      price,
    ])
    .then((result) => result.rows[0]);
};

exports.isUsernameTaken = (username) => {
  const query = "SELECT * FROM users WHERE username = $1;";
  return db.query(query, [username]).then((result) => result.rows.length > 0);
};
