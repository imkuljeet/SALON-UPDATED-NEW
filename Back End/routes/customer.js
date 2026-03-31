const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const customerController = require('../controllers/customer');

router.get('/profile', authenticate, customerController.getProfile);
router.put('/profile', authenticate, customerController.updateProfile);

module.exports = router;
