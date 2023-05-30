const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Handle 404 errors
router.use(errorController.pageNotFoundError);

// Handle 500 errors
router.use(errorController.internalServerError);

module.exports = router;
