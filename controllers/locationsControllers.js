const { fetchLocations } = require("../models/locationsModels");

exports.getLocations = (req, res, next) => {
  fetchLocations()
    .then((locations) => {
      res.status(200).send(locations);
    })
    .catch(next);
};
