const express = require("express");
const dotenv = require("dotenv");

const {getEntertainers} = require('./controllers/entertainersControllers')

dotenv.config();

const uploadRoutes = require("./routes/uploadRoute");
const authRoutes = require("./routes/authRoute");

const app = express();

app.use(express.json()); // To handle JSON requests

app.use("/api", uploadRoutes);
app.use("/api", authRoutes);

app.get('/api/entertainers', getEntertainers)

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 9090;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}