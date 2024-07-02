const { fetchCategories } = require("../models/categoriesModels")


exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        return res.status(200).send({categories})
    })
    .catch(next)
}