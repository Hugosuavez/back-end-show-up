const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const uploadRoutes = require("./routes/uploadRoute");

const app = express();

app.use("/api", uploadRoutes);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 9090;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
