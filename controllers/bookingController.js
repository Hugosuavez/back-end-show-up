const { fetchAllBookings, fetchBookingById } = require("../models/bookingModel");

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