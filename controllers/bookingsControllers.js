const { addBookings, fetchAllBookings, fetchBookingById } = require('../models/bookingsModels');


exports.getAllBookings = (req, res, next) => {
  fetchAllBookings()
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch(next);
};

exports.getBookingById = (req, res, next) => {
  const { bookingId } = req.params;
  fetchBookingById(bookingId)
    .then((booking) => {
      res.status(200).send({ booking });
    })
    .catch(next);
};

exports.postBookings = (req, res, next) => {
    const { user_id, entertainer_id, booking_date, event_details, address } = req.body;

    if (!user_id || !entertainer_id || !booking_date || !event_details || !address) {
        return res.status(400).send({ msg: '400: Bad Request' });
    }

    if (typeof user_id !== 'number' ||typeof entertainer_id !== 'number' || typeof booking_date !== 'string' || typeof event_details !== 'string' || typeof address !== 'string') {
        return res.status(400).send({ msg: '400: Bad Request' });
    }

    addBookings(user_id, entertainer_id, booking_date, event_details, address)
        .then(booking => {
            res.status(201).send({ booking });
        })
        .catch(next);
};
