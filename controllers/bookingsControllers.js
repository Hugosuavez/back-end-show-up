const { addBookings, fetchAllBookings, fetchBookingById, fetchBookingsByUserId, fetchBookingsByEntertainerId, selectDeleteBooking, updateBooking } = require('../models/bookingsModels');


exports.getAllBookings = (req, res, next) => {
  fetchAllBookings()
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch(next);
};

exports.getBookingById = (req, res, next) => {
  const {booking_id} = req.params
  fetchBookingById(booking_id)
    .then((booking) => {
      res.status(200).send({ booking });
    })
    .catch(next);
};

exports.postBookings = (req, res, next) => {
    const { user_id, entertainer_id, booking_date, event_date, event_details, address } = req.body;

    if (!user_id || !entertainer_id || !booking_date || !event_date || !event_details || !address) {
        return res.status(400).send({ msg: '400: Bad Request' });
    }

    if (typeof user_id !== 'number' ||typeof entertainer_id !== 'number' ||typeof event_date !== 'string' || typeof booking_date !== 'string' || typeof event_details !== 'string' || typeof address !== 'string') {
        return res.status(400).send({ msg: '400: Bad Request' });
    }

    addBookings(user_id, entertainer_id, booking_date, event_date, event_details, address)
        .then(booking => {
            res.status(201).send({ booking });
        })
        .catch(next);
};


exports.getBookingsByUserId = (req, res, next) => {
 const {user_id} = req.params

 fetchBookingsByUserId(user_id).then((bookings) => {
  res.status(200).send({bookings})
 })
 .catch(next)
}

exports.getBookingsByEntertainerId = (req, res, next) => {
  const {entertainer_id} = req.params
 
  fetchBookingsByEntertainerId(entertainer_id).then((bookings) => {
   res.status(200).send({bookings})
  })
  .catch(next)
 }

exports.deleteBooking = (req, res, next) => {
  const {booking_id} = req.params
  selectDeleteBooking(booking_id).then((booking) => {
    res.status(204).send({booking })
  })  
  .catch(next)

}

exports.patchBooking = (req, res, next) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  const errors = {};
  if (typeof status !== "string"){
      errors.status = "400: Bad Request";
  }


  if (typeof status === "undefined") {
      return res.status(400).send({ msg: '400: Bad Request' });
  }


  if (Object.keys(errors).length > 0) {
      return res.status(400).send({ error: errors });
    }


  updateBooking(booking_id, status).then((booking) => {
      res.status(200).send( { booking })
  })
  .catch(next);

}
