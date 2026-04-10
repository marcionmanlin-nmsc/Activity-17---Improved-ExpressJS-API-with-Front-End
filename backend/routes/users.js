const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const { uploadProfile } = require('../middleware/upload');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, uploadProfile.single('profile_picture'), userController.updateProfile);

module.exports = router;
