const { QueryTypes } = require('sequelize');
const ProcurementDraft = require('../models/ProcurementDraft');
const ProcurementItem = require('../models/ProcurementItem');
const sequelize = require('../config/database');

const reviewProcurementController = {index: async (req, res) => {
        try {
            const drafts =
                await sequelize.query(
                    `
                    SELECT
                        pd.*,
                        u.full_name
                    FROM procurement_draft pd
                    JOIN user u
                        ON pd.created_by = u.id
                    WHERE pd.draft_status = 'DIAJUKAN'
                    ORDER BY pd.id ASC
                    `,
                    {
                        type: QueryTypes.SELECT,
                    }
                );

            res.render(
                'reviewProcurement/index',
                {
                    drafts,
                }
            );

        } catch (error) {
            console.log(error);
            res.send(
                'Database Error'
            );
        }

    },

    show: async (req, res) => {
        try {
            const draftId =
                req.params.id;
            const draft =
                await ProcurementDraft.findByPk(
                    draftId
                );
            const items =
                await ProcurementItem.findAll({
                    where: {
                        draft_id: draftId,
                    },
                });
            res.render(
                'reviewProcurement/show',
                {
                    draft,
                    items,
                }
            );
        } catch (error) {
            console.log(error);
            res.send(
                'Database Error'
            );
        }
    },

    approveItem: async (
        req,
        res
    ) => {

        try {

            const itemId =
                req.params.id;

            const item =
                await ProcurementItem.findByPk(itemId);

            await ProcurementItem.update(
                {
                    approval_status: 'DISETUJUI',
                    approval_notes: '-'
                },
                {
                    where: {
                        id: itemId
                    }
                }
            );

            res.redirect(
                `/review-procurement/${item.draft_id}`
            );

        } catch (error) {

            console.log(error);

            res.send(
                'Database Error'
            );

        }

    },

    rejectItem: async (req, res) => {

        try {

            const itemId = req.params.id;
            const { approval_notes } = req.body;

            const item = await ProcurementItem.findByPk(itemId);

            if (!item) return res.send('Item tidak ditemukan');

            if (!approval_notes || approval_notes.trim() === '') {
                return res.send('Catatan wajib diisi saat penolakan');
            }

            await ProcurementItem.update(
                {
                    approval_status: 'DITOLAK',
                    approval_notes: approval_notes
                },
                {
                    where: { id: itemId }
                }
            );

            return res.redirect(
                `/review-procurement/${item.draft_id}`
            );

        } catch (error) {

            console.log(error);
            return res.send('Database Error');
        }
    },

    startReview: async (req, res) => {

        try {

            const draftId = req.params.id;

            const draft = await ProcurementDraft.findByPk(draftId);

            if (!draft) return res.send('Draft tidak ditemukan');

            if (draft.draft_status !== 'DIAJUKAN') {
                return res.send('Draft sudah diproses');
            }

            await ProcurementDraft.update(
                {
                    draft_status: 'SEDANG_DIREVIEW'
                },
                {
                    where: { id: draftId }
                }
            );

            return res.redirect(
                `/review-procurement/${draftId}`
            );

        } catch (error) {

            console.log(error);
            return res.send('Database Error');
        }
    },

    finalizeDraft: async (
        req,
        res
    ) => {

        try {

            const draftId = req.params.id;

            const draft = await ProcurementDraft.findByPk(draftId);

            if (!draft) return res.send('Draft tidak ditemukan');

            await ProcurementDraft.update(
                {
                    draft_status: 'TERKUNCI'
                },
                {
                    where: {id: draftId}
                }
            );

            return res.redirect(
                `/review-procurement/${draftId}`
            );

        } catch (error) {

            console.log(error);
            return res.send('Database Error');
        }
    }

};

module.exports = reviewProcurementController;