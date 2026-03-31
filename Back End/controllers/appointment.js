const Appointment = require('../models/Appointment');
const ServiceAvailability = require('../models/ServiceAvailability');

exports.bookAppointment = async (req, res) => {
  try {
    const { slotId } = req.body;
    const userId = req.user.id; // assuming authenticate middleware attaches user

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    // Check if slot exists
    const slot = await ServiceAvailability.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check if already booked
    const existing = await Appointment.findOne({ where: { slotId, status: 'booked' } });
    if (existing) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({ userId, slotId, status: 'booked' });

    return res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
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
