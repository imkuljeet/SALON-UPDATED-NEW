// Get availability for a specific service
const ServiceAvailability = require('../models/ServiceAvailability');
const Staff = require('../models/Staff');
const Service = require('../models/Service');

// Add availability for a service
exports.addAvailability = async (req, res) => {
  try {
    const { serviceId, dayOfWeek, startTime, endTime } = req.body;
    if (!serviceId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await ServiceAvailability.create({ serviceId, dayOfWeek, startTime, endTime });
    return res.status(201).json({ message: 'Service availability added successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Find service
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get availability slots for this service
    const availability = await ServiceAvailability.findAll({ where: { serviceId } });

    // Find staff with matching specialization
    const staffMembers = await Staff.findAll({ where: { specialization: service.name } });

    return res.status(200).json({ service, availability, staffMembers });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit availability slot
exports.editAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    const availability = await ServiceAvailability.findByPk(id);
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

// Delete availability slot
exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await ServiceAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    await availability.destroy();
    return res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
