const Appointment = require('../models/Appointment');
const ServiceAvailability = require('../models/ServiceAvailability');
const transporter = require('../util/mailer');
const sequelize = require('../util/database');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const User = require('../models/User');

exports.bookAppointment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { slotId } = req.body;
    const userId = req.user.id;

    if (!slotId) {
      await t.rollback();
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    // Fetch slot with related service and staff
    const slot = await ServiceAvailability.findByPk(slotId, {
      include: [Service, Staff],
      transaction: t
    });
    if (!slot) {
      await t.rollback();
      return res.status(404).json({ message: 'Slot not found' });
    }

    const existing = await Appointment.findOne({ where: { slotId, status: 'booked' }, transaction: t });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    const appointment = await Appointment.create({ userId, slotId, status: 'booked' }, { transaction: t });

    // Prepare details
    const staffName = slot.Staff ? slot.Staff.name : 'Assigned Staff';
    const serviceName = slot.Service ? slot.Service.name : 'Selected Service';
    const appointmentTime = slot.startTime; // assuming ServiceAvailability has startTime

    // Send confirmation email with details
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: req.user.email,
      subject: 'Appointment Confirmation',
      text: `Hello ${req.user.fullname},

Your appointment has been booked successfully.

Details:
- Service: ${serviceName}
- Staff: ${staffName}
- Time: ${appointmentTime}

Thank you for choosing us!`
    });

    await t.commit();
    return res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [ServiceAvailability]
    });
    return res.status(200).json({ appointments });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAppointmentsMyself = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: ServiceAvailability,
          include: [Service, Staff]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ appointments });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newSlotId } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if new slot exists and is not booked
    const slot = await ServiceAvailability.findByPk(newSlotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    const existing = await Appointment.findOne({ where: { slotId: newSlotId, status: 'booked' } });
    if (existing) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    appointment.slotId = newSlotId;
    appointment.status = 'booked';
    await appointment.save();

    return res.status(200).json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: get all appointments with customer info
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: ServiceAvailability,
          include: [Service, Staff]
        },
        {
          model: User, // <-- join User to get fullname, email, etc.
          attributes: ['id', 'fullname', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel appointment (admin)
exports.adminCancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled by admin', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reschedule appointment (admin)
exports.adminRescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newSlotId } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const slot = await ServiceAvailability.findByPk(newSlotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    const existing = await Appointment.findOne({ where: { slotId: newSlotId, status: 'booked' } });
    if (existing) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    appointment.slotId = newSlotId;
    appointment.status = 'booked';
    await appointment.save();

    res.status(200).json({ message: 'Appointment rescheduled by admin', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
