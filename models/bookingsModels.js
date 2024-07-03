const db = require('../db/connection');

exports.addBookings = (user_id, entertainer_id, booking_date, event_details, address) => {
    return db.query(`
        INSERT INTO bookings (user_id, entertainer_id, booking_date, event_details, address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [user_id, entertainer_id, booking_date, event_details, address])
    .then((result) => {
        return result.rows[0]
    }); 
};
