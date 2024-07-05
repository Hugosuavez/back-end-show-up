const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const {
  getEntertainers,
  getEntertainerById,
  patchEntertainerById,
  deleteEntertainers
} = require("./controllers/entertainersControllers");
const { 
  postBookings, 
  getAllBookings, 
  getBookingById 
} = require("./controllers/bookingsControllers");

dotenv.config();

const uploadRoutes = require("./routes/uploadRoute");
const authRoutes = require("./routes/authRoute");
const registrationRoutes = require("./routes/registrationRoute");
const usersRoute = require("./routes/usersRoute");
const messageRoute = require("./routes/messageRoute");
const { getLocations } = require("./controllers/locationsControllers");
const { getCategories } = require("./controllers/categoriesControllers");
const { getEndpoints } = require("./controllers/endpointsControllers");

const app = express();

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
app.post('/api/bookings', postBookings)
app.patch('/api/entertainers/:user_id', patchEntertainerById)
app.get('/api/locations', getLocations)
app.get('/api/categories', getCategories)
app.delete('/api/entertainers/:user_id', deleteEntertainers)

app.get("/api", getEndpoints);

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
