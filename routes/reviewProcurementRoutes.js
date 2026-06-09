const express = require('express');
const router = express.Router();
const reviewProcurementController = require('../controllers/reviewProcurementController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/review-procurement/', authMiddleware.isLoggedIn, reviewProcurementController.index);
router.get('/review-procurement/:id', authMiddleware.isLoggedIn, reviewProcurementController.show);
router.post('/review-procurement/item/:id/approve',authMiddleware.isLoggedIn,  reviewProcurementController.approveItem);
router.post('/review-procurement/item/:id/reject',authMiddleware.isLoggedIn,  reviewProcurementController.rejectItem);
router.post('/review-procurement/:id/finalize',authMiddleware.isLoggedIn,  reviewProcurementController.finalizeDraft);
router.post('/review-procurement/:id/start-review', authMiddleware.isLoggedIn, reviewProcurementController.startReview);


module.exports = router;