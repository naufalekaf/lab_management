const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

// router.get('/change-password',
//     authMiddleware.isLoggedIn,
//     authController.showChangePassword
// );
//
// router.post(
//     '/change-password',
//     authMiddleware.isLoggedIn,
//     authController.changePassword
// );

module.exports = router;