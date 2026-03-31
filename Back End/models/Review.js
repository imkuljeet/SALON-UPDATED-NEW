const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./User');
const Appointment = require('./Appointment');
const Service = require('./Service');
const Staff = require('./Staff');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

// Relationships
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

Appointment.hasOne(Review, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Review.belongsTo(Appointment, { foreignKey: 'appointmentId' });

Service.hasMany(Review, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
Review.belongsTo(Service, { foreignKey: 'serviceId' });

Staff.hasMany(Review, { foreignKey: 'staffId', onDelete: 'CASCADE' });
Review.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = Review;
