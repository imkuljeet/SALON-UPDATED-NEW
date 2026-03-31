const Staff = require('../models/Staff');

// Get all staff members
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    return res.status(200).json({ staff });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add new staff member
exports.addStaff = async (req, res) => {
  try {
    const { name, specialization, experience, bio } = req.body;
    if (!name || !specialization || !experience || !bio) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await Staff.create({ name, specialization, experience, bio });
    return res.status(201).json({ message: 'Staff member added successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    return res.status(200).json({ staff });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit staff member
exports.editStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, experience, bio } = req.body;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.name = name || staff.name;
    staff.specialization = specialization || staff.specialization;
    staff.experience = experience || staff.experience;
    staff.bio = bio || staff.bio;

    await staff.save();
    return res.status(200).json({ message: 'Staff updated successfully', staff });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    await staff.destroy();
    return res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
