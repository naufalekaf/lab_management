const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryCategory = sequelize.define('InventoryCategory', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },

}, {
    tableName: 'inventory_category',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = InventoryCategory;