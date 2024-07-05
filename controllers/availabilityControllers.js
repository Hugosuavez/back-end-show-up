const { fetchAvailability, updateAvailability } = require("../models/availabilityModels");

exports.getAvailability = (req, res, next) => {
    const { entertainer_id } = req.params;
    fetchAvailability(entertainer_id)
      .then((availability) => {
        res.status(200).send({ availability });
      })
      .catch(next);
  };

exports.patchAvailability = (req, res, next) => {
    const { entertainer_id } = req.params;
    const { date } = req.body;

    const errors = {};

    if (typeof date !== "string"){
        errors.date = "400: Bad Request";
    }


    if (typeof date === "undefined") {
        return res.status(400).send({ msg: '400: Bad Request' });
    }


    if (Object.keys(errors).length > 0) {
        return res.status(400).send({ error: errors });
      }


    updateAvailability(entertainer_id, date).then((availability) => {
        res.status(200).send( { availability })
    })
    .catch(next);

}