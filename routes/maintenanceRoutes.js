const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route protection: Allow STAFF_LAB and ADMIN
const isLabStaffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role_name === 'STAFF_LAB' || req.user.role_name === 'ADMIN')) {
        return next();
    }
    return res.status(403).send('Access Denied: Hanya untuk Staf Laboratorium atau Admin.');
};

router.get('/maintenance', authMiddleware.isLoggedIn, isLabStaffOrAdmin, maintenanceController.index);
router.get('/maintenance/create', authMiddleware.isLoggedIn, isLabStaffOrAdmin, maintenanceController.create);
router.post('/maintenance/store', authMiddleware.isLoggedIn, isLabStaffOrAdmin, maintenanceController.store);

module.exports = router;
