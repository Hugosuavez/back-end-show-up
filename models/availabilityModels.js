const db = require('../db/connection');

exports.fetchAvailability = (entertainer_id) => {
  return db
    .query(
      `SELECT * FROM availability WHERE entertainer_id = $1;`,
      [entertainer_id]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Booking not found" });
          }
      
        return rows;
    });
};

exports.updateAvailability = (entertainer_id, date) => {
    return db 
    .query(
    `UPDATE availability
    SET available = false
    WHERE entertainer_id = $1
    AND date = $2
    RETURNING *;`,
    [entertainer_id, date]
    )
    .then(({rows}) => {
        return rows[0];
    })
}

exports.addAvailability = (entertainer_id, date, available) => {
  return db
  .query(
  `INSERT INTO availability (entertainer_id, date, available)
  VALUES ($1, $2, $3)
  RETURNING *
  `
  , [entertainer_id, date, available]
  )
  .then(({ rows }) => {
    return rows[0];
  })
} 