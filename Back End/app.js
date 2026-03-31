const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');

require('dotenv').config();

const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const serviceRoutes = require('./routes/service');
const staffRoutes = require('./routes/staff');
const staffAvailabilityRoutes = require('./routes/staffAvailability');
const serviceAvailabilityRoutes = require('./routes/serviceAvailability');
const appointmentRoutes = require('./routes/appointment');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/reviewRoutes');


const Staff = require('./models/Staff');
const Service = require('./models/Service');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/customer',customerRoutes);
app.use('/service',serviceRoutes);
app.use('/staff', staffRoutes);
app.use('/availability', staffAvailabilityRoutes);
app.use('/service-availability', serviceAvailabilityRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/payment', paymentRoutes);
app.use('/reviews', reviewRoutes);




Staff.belongsToMany(Service, { through: "StaffServices" });
Service.belongsToMany(Staff, { through: "StaffServices" });

// Start cron jobs
require('./cronjobs');

sequelize.sync({ alter: true })
// sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Failed to sync database:', err));
