const { QueryTypes } = require('sequelize');
const ProcurementDraft = require('../models/ProcurementDraft');
const sequelize = require('../config/database');
const ProcurementItem = require('../models/ProcurementItem');

const procurementController = {
    index: async (req, res) => {
        try {
            const drafts = await sequelize.query(
                `
                    SELECT \procurement_draft.*, \ user.full_name
                    FROM procurement_draft
                    JOIN user ON procurement_draft.created_by = user.id
                    ORDER BY procurement_draft.id ASC 
                `,
                {
                    replacements: {userId: req.session.user.id},
                    type: QueryTypes.SELECT,
                }
            );

            res.render(
                'procurement/index', {
                    drafts,
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
            'procurement/create'
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

            const items =
                await ProcurementItem.findAll({

                    where: {
                        draft_id:
                        req.params.id
                    },

                    order: [
                        ['id', 'DESC']
                    ]

                });

            if (!draft) {
                return res.status(404).send('Draft tidak ditemukan');
            }

            res.render(
                'procurement/show',{
                    draft,
                    items
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