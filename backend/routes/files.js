const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/user/:username', fileController.getFilesByUser);
router.get('/stats', fileController.getUserStats);
router.get('/search/:username', fileController.searchFilesByUser);
module.exports = router;