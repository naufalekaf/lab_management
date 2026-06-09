const { QueryTypes } = require('sequelize');
const ProcurementDraft = require('../models/ProcurementDraft');
const ProcurementItem = require('../models/ProcurementItem');
const sequelize = require('../config/database');

const reviewProcurementController = {
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
                SELECT
                    pd.*,
                    u.full_name
                FROM procurement_draft pd
                         JOIN user u
                              ON pd.created_by = u.id
            `;
            const replacements = {};

            if (year) {
                queryStr += ` WHERE pd.procurement_year = :year`;
                replacements.year = year;
            }

            queryStr += ` ORDER BY pd.id ASC`;

            const drafts = await sequelize.query(
                queryStr,
                {
                    replacements,
                    type: QueryTypes.SELECT,
                }
            );

            const notReviewed = drafts.filter(d => d.draft_status === 'DIAJUKAN');
            const reviewing = drafts.filter(d => d.draft_status === 'SEDANG_DIREVIEW');

            res.render('reviewProcurement/index', {
                notReviewed,
                reviewing,
                availableYears,
                selectedYear: year || '',
                pageTitle: 'Review Pengadaan'
            });

        } catch (error) {
            console.log(error);
            res.send('Database Error');
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
                    pageTitle: 'Review Pengadaan'
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