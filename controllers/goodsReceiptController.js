const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProcurementDraft = require('../models/ProcurementDraft');
const ProcurementItem = require('../models/ProcurementItem');
const GoodsReceipt = require('../models/GoodsReceipt');
const Inventory = require('../models/Inventory');
const Room = require('../models/Room');
const InventoryCategory = require('../models/InventoryCategory');
const User = require('../models/User');
const QRCode = require('qrcode');

// Auto-seed initial data on load
const ensureInitialData = async () => {
    try {
        // 1. Create upload directories
        const qrDir = path.join(__dirname, '../public/uploads/qrcodes');
        const photoDir = path.join(__dirname, '../public/uploads/photos');
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir, { recursive: true });
        }
        if (!fs.existsSync(photoDir)) {
            fs.mkdirSync(photoDir, { recursive: true });
        }

        // 2. Check if user anto@lab.com exists
        const antoExists = await User.findOne({ where: { email: 'anto@lab.com' } });
        if (!antoExists) {
            await User.create({
                role_id: 4, // STAFF_ADMIN
                full_name: 'Anto Admin Staff',
                email: 'anto@lab.com',
                password: '$2b$10$piyESTj06RMJ3.gHkvSsteV0Ef3EALWzHkGx.PWVQcRNAspnzWQsu', // bcrypt hash for 'password'
                phone_number: '08123456789',
                is_active: 1
            });
            console.log('Seeded STAFF_ADMIN user: anto@lab.com');
        }

        // 3. Check if inventory_category is empty
        const categoryCount = await InventoryCategory.count();
        if (categoryCount === 0) {
            await InventoryCategory.bulkCreate([
                { category_name: 'Elektronik' },
                { category_name: 'Peralatan Lab' },
                { category_name: 'Perabotan' },
                { category_name: 'Lain-lain' }
            ]);
            console.log('Seeded default inventory categories');
        }

        // 4. Check if room is empty
        const roomCount = await Room.count();
        if (roomCount === 0) {
            await Room.create({
                room_code: 'GUDANG',
                room_name: 'Gudang Utama',
                room_description: 'Tempat penyimpanan utama barang baru masuk.'
            });
            console.log('Seeded default room: Gudang Utama');
        }
    } catch (err) {
        console.error('Error during automatic database seeding:', err);
    }
};

// Run the seeder
ensureInitialData();

const goodsReceiptController = {
    // List approved procurement drafts (TERKUNCI)
    index: async (req, res) => {
        try {
            await ensureInitialData(); // ensure directories/data exist
            const drafts = await sequelize.query(
                `
                SELECT pd.*, u.full_name as creator_name
                FROM procurement_draft pd
                JOIN user u ON pd.created_by = u.id
                WHERE pd.draft_status = 'TERKUNCI'
                ORDER BY pd.id DESC
                `,
                { type: QueryTypes.SELECT }
            );

            res.render('goodsReceipt/index', {
                title: 'Penerimaan Barang & Inventaris',
                drafts
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Show details of a finalized draft, including approved items, receipts, and associated inventories
    show: async (req, res) => {
        try {
            const draftId = req.params.id;
            const draft = await ProcurementDraft.findByPk(draftId);
            if (!draft) {
                return res.status(404).send('Draft tidak ditemukan');
            }

            // Get approved items with total received quantities
            const items = await sequelize.query(
                `
                SELECT pi.*, 
                       (SELECT COALESCE(SUM(gr.received_quantity), 0) 
                        FROM goods_receipt gr 
                        WHERE gr.procurement_item_id = pi.id) as received_qty
                FROM procurement_item pi
                WHERE pi.draft_id = :draftId AND pi.approval_status = 'DISETUJUI'
                ORDER BY pi.id ASC
                `,
                {
                    replacements: { draftId },
                    type: QueryTypes.SELECT
                }
            );

            // Get receipt logs for this draft
            const receipts = await sequelize.query(
                `
                SELECT gr.*, pi.item_name, u.full_name as receiver_name
                FROM goods_receipt gr
                JOIN procurement_item pi ON gr.procurement_item_id = pi.id
                JOIN user u ON gr.received_by = u.id
                WHERE pi.draft_id = :draftId
                ORDER BY gr.received_date DESC, gr.id DESC
                `,
                {
                    replacements: { draftId },
                    type: QueryTypes.SELECT
                }
            );

            // Get generated inventories from receipts of this draft
            const inventories = await sequelize.query(
                `
                SELECT inv.*, r.room_name, c.category_name, gr.received_date
                FROM inventory inv
                JOIN goods_receipt gr ON inv.goods_receipt_id = gr.id
                JOIN procurement_item pi ON gr.procurement_item_id = pi.id
                LEFT JOIN room r ON inv.room_id = r.id
                LEFT JOIN inventory_category c ON inv.category_id = c.id
                WHERE pi.draft_id = :draftId
                ORDER BY inv.id DESC
                `,
                {
                    replacements: { draftId },
                    type: QueryTypes.SELECT
                }
            );

            // Get rooms and categories for inline update modal
            const rooms = await Room.findAll();
            const categories = await InventoryCategory.findAll();

            res.render('goodsReceipt/show', {
                title: 'Detail Penerimaan Barang',
                draft,
                items,
                receipts,
                inventories,
                rooms,
                categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Record receipt of a procurement item
    receiveItem: async (req, res) => {
        try {
            const itemId = req.params.itemId;
            const received_quantity = parseInt(req.body.received_quantity, 10);
            const { received_date, receipt_notes } = req.body;

            const item = await ProcurementItem.findByPk(itemId);
            if (!item || item.approval_status !== 'DISETUJUI') {
                return res.status(400).send('Item tidak ditemukan atau belum disetujui');
            }

            const receivedSum = await GoodsReceipt.sum('received_quantity', {
                where: { procurement_item_id: itemId }
            }) || 0;

            const maxAllowed = item.quantity - receivedSum;

            if (isNaN(received_quantity) || received_quantity <= 0 || received_quantity > maxAllowed) {
                return res.status(400).send(`Jumlah penerimaan tidak valid. Sisa yang dapat diterima: ${maxAllowed}`);
            }

            const finalDate = received_date || new Date().toISOString().split('T')[0];

            // Create goods receipt record
            const receipt = await GoodsReceipt.create({
                procurement_item_id: itemId,
                received_quantity,
                received_date: finalDate,
                received_by: req.session.user.id,
                receipt_notes: receipt_notes || ''
            });

            // If item_type is INVENTARIS or BHP, instantiate individual inventory items
            if (item.item_type === 'INVENTARIS' || item.item_type === 'BHP') {
                let catId = item.inventory_category_id;
                if (!catId) {
                    const firstCat = await InventoryCategory.findOne();
                    catId = firstCat ? firstCat.id : 1;
                }

                for (let i = 0; i < received_quantity; i++) {
                    const tempCode = `INV-TEMP-${receipt.id}-${i + 1}-${Date.now()}`;
                    const qrPath = `/uploads/qrcodes/${tempCode}.png`;
                    const fullQrPath = path.join(__dirname, '../public', qrPath);

                    // Generate temporary QR code
                    await QRCode.toFile(fullQrPath, tempCode);

                    await Inventory.create({
                        category_id: catId,
                        goods_receipt_id: receipt.id,
                        inventory_code: tempCode,
                        inventory_name: item.item_name,
                        purchase_price: item.unit_price,
                        purchase_date: finalDate,
                        condition_status: 'BAIK',
                        inventory_status: 'AKTIF',
                        qr_code_path: qrPath
                    });
                }
            }

            res.redirect(`/goods-receipt/${item.draft_id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Edit an inventory item
    editInventory: async (req, res) => {
        try {
            const inventoryId = req.params.inventoryId;
            const inventory = await Inventory.findByPk(inventoryId);
            if (!inventory) {
                return res.status(404).send('Inventaris tidak ditemukan');
            }

            const rooms = await Room.findAll();
            const categories = await InventoryCategory.findAll();

            // Find draft ID for back redirection
            const receipt = await GoodsReceipt.findByPk(inventory.goods_receipt_id);
            const item = await ProcurementItem.findByPk(receipt.procurement_item_id);

            res.render('goodsReceipt/edit_inventory', {
                title: 'Update Inventaris',
                inventory,
                rooms,
                categories,
                draftId: item.draft_id
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Update inventory item properties and upload barcode/QR photo
    updateInventory: async (req, res) => {
        try {
            const inventoryId = req.params.inventoryId;
            const inventory = await Inventory.findByPk(inventoryId);
            if (!inventory) {
                return res.status(404).send('Inventaris tidak ditemukan');
            }

            const {
                inventory_code,
                category_id,
                room_id,
                brand,
                specification,
                condition_status,
                inventory_status,
                notes
            } = req.body;

            // Validate uniqueness of inventory_code if it changed
            if (inventory_code !== inventory.inventory_code) {
                const codeExists = await Inventory.findOne({ where: { inventory_code } });
                if (codeExists) {
                    return res.status(400).send('Nomor label / code inventaris sudah digunakan.');
                }
            }

            let imagePath = inventory.image_path;
            if (req.file) {
                imagePath = `/uploads/photos/${req.file.filename}`;
            }

            // Regenerate QR code if inventory_code changed
            let qrCodePath = inventory.qr_code_path;
            if (inventory_code !== inventory.inventory_code) {
                const qrPath = `/uploads/qrcodes/${inventory_code}.png`;
                const fullQrPath = path.join(__dirname, '../public', qrPath);
                await QRCode.toFile(fullQrPath, inventory_code);
                qrCodePath = qrPath;

                // Delete old QR code file if exists and is different
                try {
                    if (inventory.qr_code_path) {
                        const oldQrPath = path.join(__dirname, '../public', inventory.qr_code_path);
                        if (fs.existsSync(oldQrPath)) {
                            fs.unlinkSync(oldQrPath);
                        }
                    }
                } catch (e) {
                    console.error('Error deleting old QR code:', e);
                }
            }

            await inventory.update({
                inventory_code,
                category_id,
                room_id: room_id || null,
                brand,
                specification,
                condition_status,
                inventory_status,
                notes,
                qr_code_path: qrCodePath,
                image_path: imagePath
            });

            const receipt = await GoodsReceipt.findByPk(inventory.goods_receipt_id);
            const item = await ProcurementItem.findByPk(receipt.procurement_item_id);

            res.redirect(`/goods-receipt/${item.draft_id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    }
};

module.exports = goodsReceiptController;
