const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const serviceController = require('../controllers/service');

router.get('/get-services', authenticate, serviceController.getServices);
router.post('/add-service', authenticate, serviceController.addService);
router.get('/get-service/:id', authenticate, serviceController.getServiceById);  // NEW
router.put('/edit-service/:id', authenticate, serviceController.editService);    // already added
router.delete('/delete-service/:id', authenticate, serviceController.deleteService);

module.exports = router;
