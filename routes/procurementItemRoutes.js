const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const procurementItemController = require('../controllers/procurementItemController');


router.post('/procurement-item/store',authMiddleware.isLoggedIn, procurementItemController.store);
router.get('/procurement-item/:id/edit',authMiddleware.isLoggedIn, procurementItemController.edit);
router.post('/procurement-item/:id/update',authMiddleware.isLoggedIn, procurementItemController.update);
router.post('/procurement-item/:id/delete',authMiddleware.isLoggedIn, procurementItemController.destroy);


module.exports = router;