const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
  const { fullname, email, phone, password } = req.body;

  // Basic validation
  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newUser = { fullname, email, phone, password };

  console.log('User registered:', newUser);

  return res.status(200).json({ message: 'User registered successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
