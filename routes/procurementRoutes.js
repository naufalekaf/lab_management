const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/procurement',authMiddleware.isLoggedIn, procurementController.index);
router.get('/procurement/create',authMiddleware.isLoggedIn, procurementController.create);
router.post('/procurement/store',authMiddleware.isLoggedIn, procurementController.store);
router.get('/procurement/:id',authMiddleware.isLoggedIn, procurementController.show);
router.get('/procurement/:id/edit',authMiddleware.isLoggedIn, procurementController.edit);
router.post('/procurement/:id/update',authMiddleware.isLoggedIn, procurementController.update);
router.post('/procurement/:id/delete',authMiddleware.isLoggedIn, procurementController.destroy);
router.post('/procurement/:id/submit',authMiddleware.isLoggedIn, procurementController.submit);

module.exports = router;