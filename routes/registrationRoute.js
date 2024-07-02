const express = require('express');
const { registerUser, checkUsername } = require('../controllers/registrationController');

const router = express.Router();

router.post('/register', registerUser);
router.get('/check-username/:username', checkUsername);

module.exports = router;