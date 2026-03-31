const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./User');

const Preferences = sequelize.define('Preferences', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  preferences: {
    type: DataTypes.TEXT,   
    allowNull: true
  }
}, {
  tableName: 'preferences',
  timestamps: true
});


User.hasOne(Preferences, { foreignKey: 'userId', onDelete: 'CASCADE' });
Preferences.belongsTo(User, { foreignKey: 'userId' });

module.exports = Preferences;
