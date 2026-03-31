const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const availabilityController = require('../controllers/staffAvailability');

router.post('/add-availability', authenticate, availabilityController.addAvailability);
router.get('/:staffId', authenticate, availabilityController.getAvailability);
router.put('/edit/:id', authenticate, availabilityController.editAvailability);
router.delete('/delete/:id', authenticate, availabilityController.deleteAvailability);

module.exports = router;
