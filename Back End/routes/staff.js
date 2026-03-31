const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const staffController = require('../controllers/staff');

router.get('/get-staff', authenticate, staffController.getStaff);
router.post('/add-staff', authenticate, staffController.addStaff);
router.get('/get-staff/:id', authenticate, staffController.getStaffById);
router.put('/edit-staff/:id', authenticate, staffController.editStaff);
router.delete('/delete-staff/:id', authenticate, staffController.deleteStaff);

router.post('/assign-service', authenticate, staffController.assignService);

module.exports = router;
