const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Review = require('./Review');
const User = require('./User'); // optional, if you want to track which admin replied

const ReviewReply = sequelize.define('ReviewReply', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  reply: { type: DataTypes.TEXT, allowNull: false },
  // optional: track which admin wrote the reply
  adminId: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'review_replies',
  timestamps: true
});

// Relationships
Review.hasMany(ReviewReply, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
ReviewReply.belongsTo(Review, { foreignKey: 'reviewId' });

// If you want to link replies to an Admin user account:
User.hasMany(ReviewReply, { foreignKey: 'adminId', onDelete: 'SET NULL' });
ReviewReply.belongsTo(User, { foreignKey: 'adminId' });

module.exports = ReviewReply;
