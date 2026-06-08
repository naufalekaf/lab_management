const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceLog = sequelize.define('MaintenanceLog', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    inventory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    maintenance_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    maintenance_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    maintenance_type: {
        type: DataTypes.ENUM('PENCEGAHAN', 'PERBAIKAN'),
        allowNull: false,
    },
    condition_before: {
        type: DataTypes.ENUM('BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'),
        allowNull: true,
    },
    condition_after: {
        type: DataTypes.ENUM('BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'),
        allowNull: true,
    },
    maintenance_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'maintenance_log',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = MaintenanceLog;
