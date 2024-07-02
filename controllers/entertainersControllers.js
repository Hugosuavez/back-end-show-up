const {fetchEntertainers, fetchEntertainerById} = require('../models/entertainersModels')

exports.getEntertainers = (req, res, next) => {

    fetchEntertainers().then((entertainers) => {
        res.status(200).send({entertainers})
    })
    .catch(next)
}

exports.getEntertainerById = (req, res, next) => {
    const { user_id } = req.params
    fetchEntertainerById(user_id).then((entertainer) => {
        res.status(200).send({entertainer})
    })
    .catch(next)
}