const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Service = require('./Service');

const ServiceAvailability = sequelize.define('ServiceAvailability', {
  dayOfWeek: {
    type: DataTypes.ENUM(
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ),
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,   // e.g., "09:00"
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,   // e.g., "17:00"
    allowNull: false
  }
});

// Relationships: one service can have many availability slots
Service.hasMany(ServiceAvailability, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
ServiceAvailability.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = ServiceAvailability;
