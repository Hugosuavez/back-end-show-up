const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const fileUpload = require('express-fileupload');
const authController = require('../controllers/authController');

router.use(fileUpload());

router.post('/upload', authController.authenticateJWT, uploadFile);

module.exports = router;