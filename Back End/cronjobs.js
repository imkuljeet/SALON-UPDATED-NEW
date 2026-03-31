const cron = require('node-cron');
const Appointment = require('./models/Appointment');
const ServiceAvailability = require('./models/ServiceAvailability');
const Service = require('./models/Service');
const Staff = require('./models/Staff');
const User = require('./models/User');
const transporter = require('./util/mailer');

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  try {
    const appointments = await Appointment.findAll({
      where: { status: 'booked', reminderSent: false },
      include: [
        { model: ServiceAvailability, include: [Service, Staff] },
        { model: User }
      ]
    });

    for (const appt of appointments) {
      const slot = appt.ServiceAvailability;
      if (!slot) continue;

      // Convert slot.startTime into a Date object
      const [hours, minutes] = slot.startTime.split(':').map(Number);
      const slotDateTime = new Date();
      slotDateTime.setHours(hours, minutes, 0, 0);

      if (slotDateTime >= now && slotDateTime <= oneHourLater) {
        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: appt.User.email,
          subject: 'Upcoming Appointment Reminder',
          text: `Hello ${appt.User.fullname},

This is a reminder that your appointment is scheduled in 1 hour.

Details:
- Service: ${slot.Service.name}
- Staff: ${slot.Staff ? slot.Staff.name : 'Assigned Staff'}
- Time: ${slot.startTime}

See you soon!`
        });

        appt.reminderSent = true;
        await appt.save();
      }
    }
  } catch (err) {
    console.error('Cron job error:', err);
  }
});
