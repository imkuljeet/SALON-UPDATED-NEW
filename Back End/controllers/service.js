const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    return res.status(200).json({ services });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await Service.create({ name, description, price });
    return res.status(201).json({ message: 'Service added successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
