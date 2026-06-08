const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceConsumable = sequelize.define('MaintenanceConsumable', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    maintenance_log_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    consumable_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    quantity_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'maintenance_consumable',
    timestamps: false,
});

module.exports = MaintenanceConsumable;
