const db = require('../db/connection')


exports.checkLocationIsValid = (location) => {
    return db.query('SELECT * FROM locations where location = $1', [location]).then(({rows}) => {
        if(!rows.length){return Promise.reject({status: 404, msg: '404: Not Found'})}
    })
}