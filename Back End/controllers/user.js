const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ fullname, email, phone, password: hashedPassword });
    return res.status(200).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
