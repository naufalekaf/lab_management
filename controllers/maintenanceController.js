const MaintenanceLog = require('../models/MaintenanceLog');
const MaintenanceConsumable = require('../models/MaintenanceConsumable');
const StockMovement = require('../models/StockMovement');
const Inventory = require('../models/Inventory');
const Consumable = require('../models/Consumable');
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

const maintenanceController = {
    // List all maintenance logs
    index: async (req, res) => {
        try {
            const logs = await sequelize.query(
                `
                SELECT ml.*, inv.inventory_name, inv.inventory_code, u.full_name as staff_name,
                       (SELECT GROUP_CONCAT(CONCAT(c.consumable_name, ' (', mc.quantity_used, ' ', c.unit, ')') SEPARATOR ', ')
                        FROM maintenance_consumable mc
                        JOIN consumable c ON mc.consumable_id = c.id
                        WHERE mc.maintenance_log_id = ml.id) as materials_used
                FROM maintenance_log ml
                JOIN inventory inv ON ml.inventory_id = inv.id
                JOIN user u ON ml.maintenance_by = u.id
                ORDER BY ml.maintenance_date DESC, ml.id DESC
                `,
                { type: QueryTypes.SELECT }
            );

            res.render('maintenance/index', {
                title: 'Riwayat Perawatan Inventaris',
                logs
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Render maintenance entry form
    create: async (req, res) => {
        try {
            const inventories = await Inventory.findAll({
                where: { inventory_status: 'AKTIF' },
                order: [['inventory_name', 'ASC']]
            });

            const consumables = await Consumable.findAll({
                where: { is_active: 1 },
                order: [['consumable_name', 'ASC']]
            });

            res.render('maintenance/create', {
                title: 'Tambah Log Perawatan',
                inventories,
                consumables
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Save maintenance log with transaction-safe stock updates
    store: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const {
                inventory_id,
                maintenance_date,
                maintenance_type,
                condition_before,
                condition_after,
                maintenance_description,
                consumables
            } = req.body;

            const inventory = await Inventory.findByPk(inventory_id);
            if (!inventory) {
                return res.status(400).send('Aset inventaris tidak ditemukan.');
            }

            const assetName = inventory.inventory_name;

            // 1. Create Maintenance Log record
            const log = await MaintenanceLog.create({
                inventory_id,
                maintenance_by: req.session.user.id,
                maintenance_date,
                maintenance_type,
                condition_before,
                condition_after,
                maintenance_description: maintenance_description || ''
            }, { transaction: t });

            // 2. Update Inventory item's physical condition status
            await inventory.update({
                condition_status: condition_after
            }, { transaction: t });

            // 3. Process each consumable used during maintenance
            if (consumables && typeof consumables === 'object') {
                for (const [idStr, qtyStr] of Object.entries(consumables)) {
                    const cleanIdStr = idStr.replace('id_', '');
                    const consumableId = parseInt(cleanIdStr, 10);
                    const quantityUsed = parseInt(qtyStr, 10);
                    if (isNaN(quantityUsed) || quantityUsed <= 0) continue;

                    // Fetch and lock consumable for update to prevent race conditions
                    const consumable = await Consumable.findByPk(consumableId, { transaction: t });
                    if (!consumable) {
                        throw new Error(`BHP dengan ID ${consumableId} tidak ditemukan.`);
                    }

                    if (consumable.stock < quantityUsed) {
                        throw new Error(`Stok BHP "${consumable.consumable_name}" tidak mencukupi. Sisa stok: ${consumable.stock}, diminta: ${quantityUsed}.`);
                    }

                    // Deduct stock
                    await consumable.update({
                        stock: consumable.stock - quantityUsed
                    }, { transaction: t });

                    // Create log of consumable usage
                    await MaintenanceConsumable.create({
                        maintenance_log_id: log.id,
                        consumable_id: consumableId,
                        quantity_used: quantityUsed
                    }, { transaction: t });

                    // Create Stock Movement record
                    await StockMovement.create({
                        consumable_id: consumableId,
                        movement_type: 'KELUAR',
                        quantity: quantityUsed,
                        reference_type: 'PENGGUNAAN_MAINTENANCE',
                        notes: `Digunakan untuk perawatan aset: ${assetName} (Label: ${inventory.inventory_code})`,
                        created_by: req.session.user.id,
                        created_at: new Date()
                    }, { transaction: t });
                }
            }

            await t.commit();
            res.redirect('/maintenance');
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(400).send(`Proses Gagal: ${error.message}`);
        }
    }
};

module.exports = maintenanceController;
