const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    room_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    goods_receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    inventory_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    inventory_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },

    brand: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

    specification: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    purchase_price: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: true,
    },

    purchase_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },

    condition_status: {
        type: DataTypes.ENUM(
            'BAIK',
            'RUSAK_RINGAN',
            'RUSAK_BERAT',
            'DALAM_PERBAIKAN',
            'DIHAPUS'
        ),
        defaultValue: 'BAIK',
    },

    inventory_status: {
        type: DataTypes.ENUM(
            'AKTIF',
            'TIDAK_AKTIF',
            'DIGANTI'
        ),
        defaultValue: 'AKTIF',
    },

    qr_code_path: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    image_path: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

}, {
    tableName: 'inventory',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Inventory;