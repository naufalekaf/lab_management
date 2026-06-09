const ProcurementItem = require('../models/ProcurementItem');

const procurementItemController = {

    store: async (req, res) => {
        console.log(req.body);
        try {
            const {
                draft_id,
                item_type,
                inventory_category_id,
                consumable_category_id,
                replacement_inventory_id,
                item_name,
                quantity,
                unit_price,
                purchase_link
            } = req.body;

            const total_price =
                Number(quantity) * Number(unit_price);

            await ProcurementItem.create({
                draft_id,
                item_type,
                inventory_category_id:
                    item_type === 'INVENTARIS'
                        ? inventory_category_id
                        : null,
                consumable_category_id:
                    item_type === 'BHP'
                        ? consumable_category_id
                        : null,
                replacement_inventory_id:
                    item_type === 'INVENTARIS'
                        ? (replacement_inventory_id || null)
                        : null,
                item_name,
                quantity,
                unit_price,
                total_price,
                purchase_link,
                approval_status: 'MENUNGGU'
            });

            res.redirect(`/procurement/${draft_id}`);

        } catch (error) {

            console.log(error);

            res.status(500).send(
                `Error store item: ${error.message}`
            );

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
                    item,
                    pageTitle: 'Edit Barang Pengadaan',
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
                item_type,
                inventory_category_id,
                consumable_category_id,
                replacement_inventory_id,
                item_name,
                quantity,
                unit_price,
                purchase_link
            } = req.body;

            const total_price =
                Number(quantity) * Number(unit_price);

            await ProcurementItem.update({
                item_type,
                inventory_category_id:
                    item_type === 'INVENTARIS'
                        ? inventory_category_id
                        : null,
                consumable_category_id:
                    item_type === 'BHP'
                        ? consumable_category_id
                        : null,
                replacement_inventory_id:
                    item_type === 'INVENTARIS'
                        ? (replacement_inventory_id || null)
                        : null,
                item_name,
                quantity,
                unit_price,
                total_price,
                purchase_link
            }, {
                where: {
                    id: itemId
                }
            });

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