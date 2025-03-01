const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require('multer');
const path = require('path');

const {
  getEntertainers,
  getEntertainerById,
  patchEntertainerById,
  deleteEntertainers
} = require("./controllers/entertainersControllers");
const { 
  postBookings, 
  getAllBookings, 
  getBookingById,
  getBookingsByUserId ,
  getBookingsByEntertainerId,
  deleteBooking,
  patchBooking
} = require("./controllers/bookingsControllers");
const { getAvailability, patchAvailability, postAvailability } = require('./controllers/availabilityControllers')

dotenv.config();

const uploadRoutes = require("./routes/uploadRoute");
const authRoutes = require("./routes/authRoute");
const registrationRoutes = require("./routes/registrationRoute");
const usersRoute = require("./routes/usersRoute");
const messageRoute = require("./routes/messageRoute");
const { getLocations } = require("./controllers/locationsControllers");
const { getCategories } = require("./controllers/categoriesControllers");
const { getEndpoints } = require("./controllers/endpointsControllers");
const { authenticateJWT } = require("./controllers/authController");

const app = express();


const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 1024 * 10 } // 10MB file size limit
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", uploadRoutes);
app.use("/api", authRoutes);
app.use("/api", registrationRoutes);
app.use("/api", usersRoute);
app.use("/api", messageRoute);

app.get("/api/entertainers", getEntertainers);
app.get("/api/entertainers/:user_id", getEntertainerById);
app.get('/api/bookings', getAllBookings);
app.get('/api/bookings/:booking_id', getBookingById);
app.post('/api/bookings', authenticateJWT, postBookings)
app.patch('/api/entertainers/:user_id', patchEntertainerById)
app.get('/api/locations', getLocations)
app.get('/api/categories', getCategories)
app.delete('/api/entertainers/:user_id', deleteEntertainers)
app.get('/api/availability/:entertainer_id', getAvailability)
app.patch('/api/availability/:entertainer_id', patchAvailability)
app.post('/api/availability', postAvailability)
app.delete('/api/bookings/:booking_id', deleteBooking);
app.patch('/api/bookings/:booking_id', patchBooking)
app.get('/api/customer-bookings/:user_id', authenticateJWT, getBookingsByUserId)
app.get('/api/entertainer-bookings/:entertainer_id', authenticateJWT, getBookingsByEntertainerId)

app.get("/api", getEndpoints);

//File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "400: Bad Request" });
  } else {
    console.log(err); // Log unexpected errors
    res.status(500).send({ msg: err.message });
  }
});

// Catch-all for unknown routes
app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: route not found" });
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 9090;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
