// routes/appointment.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const appointmentController = require('../controllers/appointment');

// Customer routes
router.post('/book', authenticate, appointmentController.bookAppointment);
router.get('/my-appointments', authenticate, appointmentController.getAppointments);
router.put('/cancel/:id', authenticate, appointmentController.cancelAppointment);
router.get('/my', authenticate, appointmentController.getAppointmentsMyself);
router.put('/reschedule/:id', authenticate, appointmentController.rescheduleAppointment);

// Middleware to check admin role
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
}

// Admin routes
router.get('/all', authenticate, isAdmin, appointmentController.getAllAppointments);
router.put('/admin-cancel/:id', authenticate, isAdmin, appointmentController.adminCancelAppointment);
router.put('/admin-reschedule/:id', authenticate, isAdmin, appointmentController.adminRescheduleAppointment);

module.exports = router;
