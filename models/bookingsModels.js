const db = require('../db/connection');

exports.addBookings = (user_id, entertainer_id, booking_date, event_date, event_details, address) => {
    return db.query(`
        INSERT INTO bookings (user_id, entertainer_id, booking_date, event_date, event_details, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [user_id, entertainer_id, booking_date, event_date, event_details, address])
    .then((result) => {
        return result.rows[0]
    }); 
};

exports.fetchAllBookings = () => {
  return db
    .query(
      `SELECT booking_id, user_id, entertainer_id, booking_date, event_date, event_details, address, status FROM bookings;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchBookingById = (bookingId) => {
  return db
    .query(
      `SELECT booking_id, user_id, entertainer_id, booking_date, event_date, event_details, address, status FROM bookings WHERE booking_id = $1;`,
      [bookingId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Booking not found" });
      }
      return rows[0];
    });
};

exports.fetchBookingsByUserId = (user_id) => {
  return db.query('SELECT * FROM bookings WHERE user_id = $1', [user_id]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "id not found" });
    }
    return rows
  })
}

exports.fetchBookingsByEntertainerId = (entertainer_id) => {
  return db.query('SELECT * FROM bookings WHERE entertainer_id = $1', [entertainer_id]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "id not found" });
    }
    return rows
  })
}


exports.selectDeleteBooking = (booking_id) => {

  return db.query(
      `DELETE FROM bookings 
       WHERE booking_id = $1 
       RETURNING *;`,
      [booking_id]
  )
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject(
     { status: 404, 
     msg: `404: route not found` });
     }
 });
};

exports.updateBooking= (booking_id, status) => {
  return db 
  .query(
  `UPDATE bookings
  SET status = $2
  WHERE booking_id = $1
  RETURNING *;`,
  [booking_id, status]
  )
  .then(({rows}) => {
      return rows[0];
  })
}