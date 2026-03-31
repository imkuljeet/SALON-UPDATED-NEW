const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');

require('dotenv').config();

const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/customer',customerRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Failed to sync database:', err));
