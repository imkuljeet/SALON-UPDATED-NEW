const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./User');
const ServiceAvailability = require('./ServiceAvailability');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: {
    type: DataTypes.ENUM('pending', 'booked', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'appointments',
  timestamps: true
});

// Relationships
User.hasMany(Appointment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

ServiceAvailability.hasMany(Appointment, { foreignKey: 'slotId', onDelete: 'CASCADE' });
Appointment.belongsTo(ServiceAvailability, { foreignKey: 'slotId' });

module.exports = Appointment;
