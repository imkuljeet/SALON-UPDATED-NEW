const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Staff = require('./Staff');

const StaffAvailability = sequelize.define('StaffAvailability', {
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

// Relationships: one staff can have many availability slots
Staff.hasMany(StaffAvailability, { foreignKey: 'staffId', onDelete: 'CASCADE' });
StaffAvailability.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = StaffAvailability;
