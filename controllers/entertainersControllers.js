const { checkCategoryIsValid } = require('../models/categoriesModels')
const {fetchEntertainers, fetchEntertainerById} = require('../models/entertainersModels')
const { checkLocationIsValid } = require('../models/locationsModels')

exports.getEntertainers = (req, res, next) => {
    const { location, category, date } = req.query

    const promises = [fetchEntertainers(location, category, date)]

    if(location){promises.push(checkLocationIsValid(location))}
    if(category){promises.push(checkCategoryIsValid(category))}
    

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