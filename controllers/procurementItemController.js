const ProcurementItem = require('../models/ProcurementItem');

const procurementItemController = {

    store: async (req, res) => {
        try {
            const {
                draft_id,
                item_type,
                item_name,
                quantity,
                estimated_price,
                purchase_link
            } = req.body;

            await ProcurementItem.create({
                draft_id,
                item_type,
                item_name,
                quantity,
                estimated_price,
                purchase_link
            });

            res.redirect(
                `/procurement/${draft_id}`
            );

        } catch (error) {
            console.log(error);
            res.status(500)
                .send(error.message);

        }

    },

    edit: async (req, res) => {
        try {
            const item =
                await ProcurementItem.findByPk(
                    req.params.id
                );

            res.render(
                'procurementItem/edit',
                {
                    item
                }
            );

        } catch (error) {

            console.log(error);

            res.send(error.message);

        }

    },

    update: async (req, res) => {
        try {
            const itemId =
                req.params.id;

            const {
                // draft_id,
                item_type,
                item_name,
                quantity,
                estimated_price,
                purchase_link
            } = req.body;

            const item =
                await ProcurementItem.findByPk(
                    itemId
                );

            await ProcurementItem.update(
                {
                    item_type,
                    item_name,
                    quantity,
                    estimated_price,
                    purchase_link

                },
                {
                    where: {
                        id: itemId
                    }
                }
            );

            res.redirect(
                `/procurement/${item.draft_id}`
            );

        } catch (error) {

            console.log(error);

            res.status(500)
                .send(error.message);

        }

    },

    destroy: async (req, res) => {

        try {

            const item =
                await ProcurementItem.findByPk(
                    req.params.id
                );

            const draftId =
                item.draft_id;

            await ProcurementItem.destroy({
                where: {
                    id: req.params.id
                }
            });

            res.redirect(
                `/procurement/${draftId}`
            );

        } catch (error) {

            console.log(error);

            res.status(500)
                .send(error.message);

        }

    }

};

module.exports = procurementItemController;