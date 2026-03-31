const User = require('../models/User');
const Preferences = require('../models/Preferences');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: Preferences
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullname, phone, preferences } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ fullname, phone });

    let prefs = await Preferences.findOne({ where: { userId: req.user.id } });
    if (!prefs) {
      prefs = await Preferences.create({ userId: req.user.id, preferences });
    } else {
      await prefs.update({ preferences });
    }

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
