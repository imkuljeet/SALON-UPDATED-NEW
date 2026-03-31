const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const appointmentController = require('../controllers/appointment');

router.post('/book', authenticate, appointmentController.bookAppointment);
router.get('/my-appointments', authenticate, appointmentController.getAppointments);
router.put('/cancel/:id', authenticate, appointmentController.cancelAppointment);
// routes/appointment.js
router.get('/my', authenticate, appointmentController.getAppointmentsMyself);

router.put('/reschedule/:id', authenticate, appointmentController.rescheduleAppointment);


module.exports = router;
