\c show_up_dev

SELECT users.*, userMedia.url, userMedia.media_id FROM users JOIN userMedia ON users.user_id = userMedia.user_id JOIN availability ON users.user_id = availability.entertainer_id WHERE user_type = 'Entertainer'