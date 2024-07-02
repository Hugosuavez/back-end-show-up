const express = require("express");
const dotenv = require("dotenv");

const {getEntertainers, getEntertainerById} = require('./controllers/entertainersControllers')

dotenv.config();

const uploadRoutes = require("./routes/uploadRoute");
const authRoutes = require("./routes/authRoute");

const app = express();

app.use(express.json()); // To handle JSON requests

app.use("/api", uploadRoutes);
app.use("/api", authRoutes);

app.get('/api/entertainers', getEntertainers)

app.get('/api/entertainers/:user_id', getEntertainerById)

app.use((err, req, res, next) => {
  if(err.msg){
      res.status(err.status).send({msg: err.msg})
  }
  else next(err)
})

app.use((err, req, res, next) => {
  if(err.code === '22P02'){
      res.status(400).send({msg: '400: Bad Request'})
  }
  else next(err)
})

app.all('*', (req, res) => {
  res.status(404).send({msg: "404: route not found"})
    });


module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 9090;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}