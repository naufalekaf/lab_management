const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoodsReceipt = sequelize.define('GoodsReceipt', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    procurement_item_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    received_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    received_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    received_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    receipt_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'goods_receipt',
    timestamps: false,
});

module.exports = GoodsReceipt;
