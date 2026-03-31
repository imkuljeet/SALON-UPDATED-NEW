const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const serviceAvailabilityController = require('../controllers/serviceAvailability');

router.post('/add-availability', authenticate, serviceAvailabilityController.addAvailability);
router.get('/:serviceId', authenticate, serviceAvailabilityController.getAvailability);
router.put('/edit/:id', authenticate, serviceAvailabilityController.editAvailability);
router.delete('/delete/:id', authenticate, serviceAvailabilityController.deleteAvailability);

module.exports = router;
