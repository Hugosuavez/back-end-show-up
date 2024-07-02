const db = require('../db/connection')

exports.fetchEntertainers = () => {
    return db.query(`SELECT users.*, userMedia.url, userMedia.media_id FROM users JOIN userMedia ON users.user_id = userMedia.user_id WHERE user_type = 'Entertainer';`).then((result) => {
        return result.rows
    })
}
