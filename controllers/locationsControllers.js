const { fetchLocations } = require('../models/locationsModels')

exports.getLocations = (req, res, next) => {
    fetchLocations().then((location) => {
        res.status(200).send({location})
    })
    .catch(next)   
}