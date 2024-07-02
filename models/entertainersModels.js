const db = require('../db/connection')

exports.fetchEntertainers = (location, category) => {
   
    let queryString = `SELECT users.*, userMedia.url, userMedia.media_id FROM users JOIN userMedia ON users.user_id = userMedia.user_id WHERE user_type = 'Entertainer'`

    let queryValues = []

    if(location){
        queryString += ` AND location = $1`
        queryValues.push(location)
    }

    if(category){
        if(location){queryString += ` AND category = $2`}
        else{queryString += ` AND category = $1`}
        queryValues.push(category)
    }
   
    return db.query(queryString, queryValues).then((result) => {
        return result.rows
    })
}

exports.fetchEntertainerById = (user_id) => {
return db.query(`SELECT users.*, userMedia.url, userMedia.media_id FROM users JOIN userMedia ON users.user_id = userMedia.user_id WHERE user_type = 'Entertainer' AND users.user_id = $1;`, [user_id]).then((result) => {
    
    if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: '404: Not Found'})
    }
    return result.rows[0]
})
}