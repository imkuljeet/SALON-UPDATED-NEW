const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Service = require('./Service');
const Staff = require('./Staff');

const ServiceAvailability = sequelize.define('ServiceAvailability', {
  dayOfWeek: {
    type: DataTypes.ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  }
});

// Relationships
Service.hasMany(ServiceAvailability, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
ServiceAvailability.belongsTo(Service, { foreignKey: 'serviceId' });

Staff.hasMany(ServiceAvailability, { foreignKey: 'staffId', onDelete: 'CASCADE' });
ServiceAvailability.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = ServiceAvailability;
