const express = require('express');
const router = express.Router();
const consumableController = require('../controllers/consumableController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route protection: Allow STAFF_LAB and ADMIN
const isLabStaffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role_name === 'STAFF_LAB' || req.user.role_name === 'ADMIN')) {
        return next();
    }
    return res.status(403).send('Access Denied: Hanya untuk Staf Laboratorium atau Admin.');
};

router.get('/consumables', authMiddleware.isLoggedIn, isLabStaffOrAdmin, consumableController.index);
router.get('/consumables/create', authMiddleware.isLoggedIn, isLabStaffOrAdmin, consumableController.create);
router.post('/consumables/store', authMiddleware.isLoggedIn, isLabStaffOrAdmin, consumableController.store);
router.post('/consumables/:id/adjust-stock', authMiddleware.isLoggedIn, isLabStaffOrAdmin, consumableController.adjustStock);

module.exports = router;
