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

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.destroy();
    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;

    await service.save();
    return res.status(200).json({ message: 'Service updated successfully', service });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.status(200).json({ service });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


