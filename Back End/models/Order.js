// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Appointment = require('./Appointment');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SUCCESSFUL', 'FAILED'),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

// Relationships
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

Appointment.hasOne(Order, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Order.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = Order;
