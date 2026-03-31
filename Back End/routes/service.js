const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const serviceController = require('../controllers/service');

router.get('/get-services', authenticate, serviceController.getServices);
router.post('/add-service', authenticate, serviceController.addService);

module.exports = router;
