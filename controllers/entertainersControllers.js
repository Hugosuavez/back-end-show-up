const {fetchEntertainers} = require('../models/entertainersModels')

exports.getEntertainers = (req, res, next) => {

    fetchEntertainers().then((entertainers) => {
        res.status(200).send({entertainers})
    })
    .catch(next)
}