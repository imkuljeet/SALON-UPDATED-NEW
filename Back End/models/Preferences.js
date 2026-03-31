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
    type: DataTypes.TEXT,   // free-form text field
    allowNull: true
  }
}, {
  tableName: 'preferences',
  timestamps: true
});

// Associations
User.hasOne(Preferences, { foreignKey: 'userId', onDelete: 'CASCADE' });
Preferences.belongsTo(User, { foreignKey: 'userId' });

module.exports = Preferences;
