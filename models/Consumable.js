const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consumable = sequelize.define('Consumable', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    consumable_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    consumable_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    minimum_stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    latest_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
    },
    storage_location: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
}, {
    tableName: 'consumable',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Consumable;
