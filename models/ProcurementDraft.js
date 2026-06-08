const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProcurementDraft = sequelize.define('ProcurementDraft', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },

    draft_title: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },

    procurement_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    draft_status: {
        type: DataTypes.ENUM(
            'DRAF',
            'DIAJUKAN',
            'SEDANG_DIREVIEW',
            'TERKUNCI'
        ),
        defaultValue: 'DRAF',
    },

    notes: {
        type: DataTypes.TEXT,
    },

    submitted_at: {
        type: DataTypes.DATE,
    },

    finalized_by: {
        type: DataTypes.BIGINT.UNSIGNED,
    },

    finalized_at: {
        type: DataTypes.DATE,
    },

}, {
    tableName: 'procurement_draft',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = ProcurementDraft;