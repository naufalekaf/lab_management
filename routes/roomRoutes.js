const express = require('express');

const router = express.Router();

const roomController = require('../controllers/roomController');

const authMiddleware = require('../middlewares/authMiddleware');

const roleMiddleware = require('../middlewares/roleMiddleware');

// INDEX
router.get(
    '/rooms',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    roomController.index
);

// CREATE FORM
router.get(
    '/rooms/create',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    roomController.create
);

// STORE
router.post(
    '/rooms/store',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    roomController.store
);

// EDIT FORM
router.get(
    '/rooms/edit/:id',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    roomController.edit
);

// UPDATE
router.post(
    '/rooms/update/:id',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    roomController.update
);

// DELETE
router.get(
    '/rooms/delete/:id',
    authMiddleware.isLoggedIn,
    roleMiddleware.isAdmin,
    roomController.destroy
);

module.exports = router;