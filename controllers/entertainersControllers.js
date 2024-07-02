const {fetchEntertainers, fetchEntertainerById} = require('../models/entertainersModels')
const { checkLocationIsValid } = require('../models/locationsModels')

exports.getEntertainers = (req, res, next) => {
    const { location } = req.query

    const promises = [fetchEntertainers(location)]

    if(location){promises.push(checkLocationIsValid(location))}

    Promise.all(promises).then((resolvedPromises) => {
        const entertainers = resolvedPromises[0]
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