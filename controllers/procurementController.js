const { QueryTypes } = require('sequelize');
const ProcurementDraft = require('../models/ProcurementDraft');
const sequelize = require('../config/database');
const ProcurementItem = require('../models/ProcurementItem');
const Inventory = require('../models/Inventory');
const InventoryCategory = require('../models/InventoryCategory');
const ConsumableCategory = require('../models/ConsumableCategory');

const procurementController = {
    index: async (req, res) => {
        try {
            const { year } = req.query;

            // 1. Get distinct years for the filter dropdown
            const yearsResult = await sequelize.query(
                `SELECT DISTINCT procurement_year FROM procurement_draft ORDER BY procurement_year DESC`,
                { type: QueryTypes.SELECT }
            );
            const availableYears = yearsResult.map(y => y.procurement_year);

            // 2. Build draft query with optional year filter
            let queryStr = `
                SELECT procurement_draft.*, user.full_name
                FROM procurement_draft
                JOIN user ON procurement_draft.created_by = user.id
            `;
            const replacements = {};

            if (year) {
                queryStr += ` WHERE procurement_draft.procurement_year = :year`;
                replacements.year = year;
            }

            queryStr += ` ORDER BY procurement_draft.id ASC`;

            const drafts = await sequelize.query(
                queryStr,
                {
                    replacements,
                    type: QueryTypes.SELECT,
                }
            );

            res.render(
                'procurement/index', {
                    drafts,
                    availableYears,
                    selectedYear: year || '',
                    pageTitle: 'Pengadaan'
                });

        } catch (error) {
            console.log(error);
            res.status(500).send(
                `Error Server: ${error.message}`
            );
        }
    },

    create: async (req, res) => {
        res.render(
            'procurement/create',{
            pageTitle: 'Tambah Pengadaan',
        }
        );
    },

    store: async (req, res) => {
        try {
            const {
                draft_title,
                procurement_year,
                notes,
            } = req.body;
            await ProcurementDraft.create({
                created_by: req.session.user.id,
                draft_title,
                procurement_year,
                notes,
                draft_status: 'DRAF',
            });

            res.redirect(
                '/procurement'
            );

        } catch (error) {
            console.log(error);
            res.status(500).send(
                `Error Server: ${error.message}`
            );
        }
    },

    show: async (req, res) => {
        try {
            const draft =
                await ProcurementDraft.findOne({
                    where: {
                        id: req.params.id,
                        created_by:
                        req.session.user.id,
                    }
                });

            const items = await sequelize.query(
                `
SELECT

    procurement_item.*,

    inventory_category.category_name
        AS inventory_category_name,

    consumable_category.category_name
        AS consumable_category_name,

    inventory.inventory_name
        AS replacement_inventory_name

FROM procurement_item

LEFT JOIN inventory_category
    ON inventory_category.id =
    procurement_item.inventory_category_id

LEFT JOIN consumable_category
    ON consumable_category.id =
    procurement_item.consumable_category_id

LEFT JOIN inventory
    ON inventory.id =
    procurement_item.replacement_inventory_id

WHERE procurement_item.draft_id = ?

ORDER BY procurement_item.id DESC
`,
                {
                    replacements: [
                        req.params.id
                    ],

                    type: QueryTypes.SELECT
                });

            const grandTotal =
                items.reduce(
                    (total, item) =>
                        total + Number(item.total_price),
                    0
                );

            const inventoryCategories =
                await InventoryCategory.findAll();

            const consumableCategories =
                await ConsumableCategory.findAll();

            const inventories =
                await Inventory.findAll({
                    where: {
                        inventory_status: 'AKTIF'
                    }

                });

            if (!draft) {
                return res.status(404).send('Draft tidak ditemukan');
            }

            res.render(
                'procurement/show',{
                    draft,
                    items,
                    inventories,
                    consumableCategories,
                    inventoryCategories,
                    grandTotal,
                    pageTitle: draft.draft_title
                });

        } catch (error) {
            console.log(error);
            res.status(500).send(
                `Error Server: ${error.message}`
            );
        }
    },

    edit: async (req, res) => {
        try {
            const draftId = req.params.id;

            const draft =
                await ProcurementDraft.findOne({
                    where: {
                        id: req.params.id,
                        created_by: req.session.user.id,
                    }
                });

            if (!draft) {
                return res.status(404).send('Draft tidak ditemukan');
            }

            res.render(
                'procurement/edit',{
                    draft,
                    pageTitle: 'Edit Pengadaan'
                });

        } catch (error) {
            console.log(error);
            res.status(500).send(
                `Error Server: ${error.message}`
            );
        }
    },

    update: async (req, res) => {
        try {
            const draftId = req.params.id;

            const {
                draft_title,
                procurement_year,
                notes,
            } = req.body;

            await ProcurementDraft.update(
                {
                    draft_title,
                    procurement_year,
                    notes,
                },
                {
                    where: {
                        id: draftId,
                    },
                }
            );

            res.redirect(
                '/procurement'
            );

        } catch (error) {

            console.log(error);

            res.status(500).send(
                `Error Server: ${error.message}`
            );

        }

    },

    submit: async (req, res) => {
        try {
            const draftId =
                req.params.id;

            const totalItem =
                await ProcurementItem.count({
                    where: {
                        draft_id: draftId
                    }
                });

            if (totalItem === 0) {
                return res.send(
                    'Draft belum memiliki barang'
                );
            }

            await ProcurementDraft.update(
                {
                    draft_status: 'DIAJUKAN',
                    submitted_at: new Date()
                },
                {
                    where: {
                        id: draftId
                    }
                }
            );

            res.redirect(
                `/procurement/${draftId}`
            );
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    },


    destroy: async (req, res) => {
        try {
            const draftId =
                req.params.id;

            await ProcurementDraft.destroy({
                where: {
                    id: req.params.id,
                    created_by:
                    req.session.user.id,
                }
            });

            res.redirect(
                '/procurement'
            );

        } catch (error) {

            console.log(error);

            res.status(500).send(
                `Error Server: ${error.message}`
            );

        }

    },

};

module.exports = procurementController;