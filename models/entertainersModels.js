const db = require('../db/connection')

exports.fetchEntertainers = (location, category, date) => {
   
    let queryString = `SELECT users.*, userMedia.url, userMedia.media_id FROM users JOIN userMedia ON users.user_id = userMedia.user_id`

    let queryValues = []

    const correctDateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/

    if(date){
        if(correctDateRegex.test(date)){
        queryString += ` JOIN availability ON users.user_id = availability.entertainer_id AND date = $1 AND available = true`
        queryValues.push(date)}
        else{return Promise.reject({status: 404, msg: '404: Not Found'})}
    }
    
    if(location){
        if(date){` AND location = $2`}
        else{queryString += ` AND location = $1`}
        queryValues.push(location)
    }
    
    if(category){
        if(location && date){queryString += ` AND category = $3`}
        else if(location || date){queryString += ` AND category = $2`}
        else{queryString += ` AND category = $1`}
        queryValues.push(category)
    }

    queryString += ` WHERE user_type = 'Entertainer'`

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