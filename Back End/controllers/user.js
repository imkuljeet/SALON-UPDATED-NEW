const users = [];

exports.signup = (req, res) => {
  const { fullname, email, phone, password } = req.body;
  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const newUser = { fullname, email, phone, password };
  users.push(newUser);
  console.log('User registered:', newUser);
  return res.status(200).json({ message: 'User registered successfully!' });
};
