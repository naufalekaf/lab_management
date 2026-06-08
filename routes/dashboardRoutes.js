const express = require('express');
const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get(
    '/dashboard',
    authMiddleware.isLoggedIn,
    dashboardController.index
);

module.exports = router;