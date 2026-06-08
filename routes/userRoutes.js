const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// INDEX
router.get(
    '/users',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    userController.index
);

// CREATE FORM
router.get(
    '/users/create',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    userController.create
);

// STORE
router.post(
    '/users/store',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    userController.store
);

// EDIT FORM
router.get(
    '/users/edit/:id',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    userController.edit
);

// UPDATE
router.post(
    '/users/update/:id',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    userController.update
);

// DELETE
router.get(
    '/users/delete/:id',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    userController.destroy
);

// profile
router.get("/profile", authMiddleware.isLoggedIn, userController.getProfile);
router.post("/profile", authMiddleware.isLoggedIn, userController.updateProfile);

// Change password
router.get("/change-password", authMiddleware.isLoggedIn, userController.getChangePassword);
router.post("/change-password", authMiddleware.isLoggedIn, userController.postChangePassword);

module.exports = router;