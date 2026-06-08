const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProcurementItem = sequelize.define('ProcurementItem', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    draft_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },

    item_type: {
        type: DataTypes.ENUM(
            'INVENTARIS',
            'BHP'
        ),
        allowNull: false,
    },

    inventory_category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
    },

    consumable_category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
    },

    item_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    estimated_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },

    purchase_link: {
        type: DataTypes.TEXT,
    },

    approval_status: {
        type: DataTypes.ENUM(
            'MENUNGGU',
            'DISETUJUI',
            'DITOLAK'
        ),
        defaultValue: 'MENUNGGU',
    },

    approval_notes: {
        type: DataTypes.TEXT,
    },

    replacement_inventory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
    },

}, {
    tableName: 'procurement_item',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = ProcurementItem;