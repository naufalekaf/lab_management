const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    consumable_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    movement_type: {
        type: DataTypes.ENUM('MASUK', 'KELUAR'),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reference_type: {
        type: DataTypes.ENUM('PENERIMAAN_PENGADAAN', 'PENGGUNAAN_MAINTENANCE', 'PENYESUAIAN_MANUAL'),
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'stock_movement',
    timestamps: false,
});

module.exports = StockMovement;
