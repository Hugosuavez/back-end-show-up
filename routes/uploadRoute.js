const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const fileUpload = require('express-fileupload');

router.use(fileUpload());
router.post('/upload', uploadFile);

module.exports = router;