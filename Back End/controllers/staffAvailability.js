const StaffAvailability = require('../models/StaffAvailability;');

// Add availability
exports.addAvailability = async (req, res) => {
  try {
    const { staffId, dayOfWeek, startTime, endTime } = req.body;
    if (!staffId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await StaffAvailability.create({ staffId, dayOfWeek, startTime, endTime });
    return res.status(201).json({ message: 'Availability added successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get availability for a staff member
exports.getAvailability = async (req, res) => {
  try {
    const { staffId } = req.params;
    const availability = await StaffAvailability.findAll({ where: { staffId } });
    return res.status(200).json({ availability });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit availability
exports.editAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    const availability = await StaffAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    availability.dayOfWeek = dayOfWeek || availability.dayOfWeek;
    availability.startTime = startTime || availability.startTime;
    availability.endTime = endTime || availability.endTime;

    await availability.save();
    return res.status(200).json({ message: 'Availability updated successfully', availability });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete availability
exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await StaffAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    await availability.destroy();
    return res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
