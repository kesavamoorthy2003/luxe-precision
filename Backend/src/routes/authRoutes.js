const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/register',         authController.register);
router.post('/login',            authController.login);
router.put('/update-profile',    protect, authController.updateProfile);
router.post('/upload-avatar',    protect, upload.single('avatar'), authController.uploadAvatar);
router.post('/change-password',  protect, authController.changePassword);

module.exports = router;