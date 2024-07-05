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
      `SELECT booking_id, user_id, entertainer_id, booking_date, event_date, event_details, address FROM bookings;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchBookingById = (bookingId) => {
  return db
    .query(
      `SELECT booking_id, user_id, entertainer_id, booking_date, event_date, event_details, address FROM bookings WHERE booking_id = $1;`,
      [bookingId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Booking not found" });
      }
      return rows[0];
    });
};
