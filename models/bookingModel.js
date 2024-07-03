const db = require("../db/connection");

exports.fetchAllBookings = () => {
  return db
    .query(
      `SELECT booking_id, user_id, entertainer_id, booking_date, event_details, address FROM bookings;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchBookingById = (bookingId) => {
  return db
    .query(
      `SELECT booking_id, user_id, entertainer_id, booking_date, event_details, address FROM bookings WHERE booking_id = $1;`,
      [bookingId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Booking not found" });
      }
      return rows[0];
    });
};
