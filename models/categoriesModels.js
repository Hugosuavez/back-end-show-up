const db = require('../db/connection')

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories ORDER BY category ASC;').then((result) => {
        return result.rows
    })
}

exports.checkCategoryIsValid = (category) => {
    return db.query('SELECT * FROM categories WHERE category = $1', [category]).then(({rows}) => {
        if(!rows.length){return Promise.reject({status: 404, msg: '404: Not Found'})}
    })
}