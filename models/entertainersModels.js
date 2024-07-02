const db = require('../db/connection')

exports.fetchEntertainers = () => {
    return db.query(`SELECT users.*, userMedia.url, userMedia.media_id FROM users JOIN userMedia ON users.user_id = userMedia.user_id WHERE user_type = 'Entertainer';`).then((result) => {
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