const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    unsigned: true,
  },
  room_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  room_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  room_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'room',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Room;
