const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const goodsReceiptController = require('../controllers/goodsReceiptController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configure multer storage for physical QR/barcode photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/photos'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya diperbolehkan mengunggah file gambar!'));
        }
    }
});

// Authorization check for STAFF_ADMIN or ADMIN role
const isStaffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role_name === 'STAFF_ADMIN' || req.user.role_name === 'ADMIN')) {
        return next();
    }
    return res.status(403).send('Access Denied: Hanya untuk Staff Admin atau Admin.');
};

router.get('/goods-receipt', authMiddleware.isLoggedIn, isStaffOrAdmin, goodsReceiptController.index);
router.get('/goods-receipt/:id', authMiddleware.isLoggedIn, isStaffOrAdmin, goodsReceiptController.show);
router.post('/goods-receipt/item/:itemId/receive', authMiddleware.isLoggedIn, isStaffOrAdmin, goodsReceiptController.receiveItem);
router.get('/goods-receipt/inventory/:inventoryId/edit', authMiddleware.isLoggedIn, isStaffOrAdmin, goodsReceiptController.editInventory);
router.post('/goods-receipt/inventory/:inventoryId/update', authMiddleware.isLoggedIn, isStaffOrAdmin, upload.single('image'), goodsReceiptController.updateInventory);

module.exports = router;
