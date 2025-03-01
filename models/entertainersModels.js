const db = require("../db/connection");

exports.fetchEntertainers = (location, category, date) => {
  let queryString = `SELECT users.user_id, users.username, users.first_name, users.last_name, users.email, users.profile_img_url, users.user_type, users.category, users.location, users.entertainer_name, users.description, users.price FROM users`;
  let queryValues = [];
  const correctDateRegex =
    /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

  if (date) {
    if (correctDateRegex.test(date)) {
      queryString += ` JOIN availability ON users.user_id = availability.entertainer_id  WHERE user_type = 'Entertainer' AND date = $1 AND available = true`;
      queryValues.push(date);
    } else {
      return Promise.reject({ status: 404, msg: "404: Not Found" });
    }
  } else {
    queryString += ` WHERE user_type = 'Entertainer'`;
  }

  if (location) {
    if (date) {
      ` AND location = $2`;
    } else {
      queryString += ` AND location = $1`;
    }
    queryValues.push(location);
  }

  if (category) {
    if (location && date) {
      queryString += ` AND category = $3`;
    } else if (location || date) {
      queryString += ` AND category = $2`;
    } else {
      queryString += ` AND category = $1`;
    }
    queryValues.push(category);
  }

  return db.query(queryString, queryValues).then((result) => {
    return result.rows;
  });
};

exports.fetchEntertainerById = (user_id) => {
  const userPromise = db.query(
    `SELECT users.user_id, users.username, users.first_name, users.last_name, users.email, users.profile_img_url, users.user_type, users.category, users.location, users.entertainer_name, users.description, users.price FROM users WHERE user_type = 'Entertainer' AND users.user_id = $1;`,
    [user_id]
  );
  const urlPromise = db.query(`SELECT url FROM userMedia WHERE user_id = $1`, [
    user_id,
  ]);

  return Promise.all([userPromise, urlPromise]).then((resolvedPromises) => {
    if (resolvedPromises[0].rows.length === 0) {
      return Promise.reject({ status: 404, msg: "404: Not Found" });
    }

    const user = resolvedPromises[0].rows[0];
    user.media = [];
    const images = resolvedPromises[1].rows;

    images.forEach((image) => {
      user.media.push(image.url);
    });

    return user;
  });
};

exports.fetchUserMediaByUserId = (user_id) => {
  return db
    .query("SELECT url FROM userMedia WHERE user_id = $1", [user_id])
    .then((result) => {
      return result.rows;
    });
};


exports.updateEntertainersById = (user_id, category, location, entertainer_name, description, price, email ) => {

  const query = `
    UPDATE users
    SET 
      category = COALESCE($2, category),
      location = COALESCE($3, location),
      entertainer_name = COALESCE($4, entertainer_name),
      description = COALESCE($5, description),
      price = COALESCE($6, price),
      email = COALESCE($7, email)
    WHERE user_id = $1
    RETURNING *
  `;

  const values = [user_id, category, location, entertainer_name, description, price, email];

  return db.query(query, values)
    .then((result) => {
      return result.rows[0]
    });
}

exports.selectDeleteUser = (user_id) => {
  return db.query(
      `DELETE FROM users 
       WHERE user_id = $1 
       RETURNING *;`,
      [user_id]
  )
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject(
     { status: 404, 
     msg: `404: route not found` });
     }
 });
};
