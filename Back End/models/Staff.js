const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Staff = sequelize.define('Staff', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Staff;
