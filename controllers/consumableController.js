const Consumable = require('../models/Consumable');
const ConsumableCategory = require('../models/ConsumableCategory');
const StockMovement = require('../models/StockMovement');
const User = require('../models/User');
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// Auto-seed initial data on load
const ensureInitialData = async () => {
    try {
        // 1. Seed stafflab@lab.com if not exists
        const staffExists = await User.findOne({ where: { email: 'stafflab@lab.com' } });
        if (!staffExists) {
            await User.create({
                role_id: 5, // STAFF_LAB
                full_name: 'Dedi Staf Laboratorium',
                email: 'stafflab@lab.com',
                password: '$2b$10$piyESTj06RMJ3.gHkvSsteV0Ef3EALWzHkGx.PWVQcRNAspnzWQsu', // bcrypt for 'password'
                phone_number: '08123456780',
                is_active: 1
            });
            console.log('Seeded STAFF_LAB user: stafflab@lab.com');
        }

        // 2. Seed consumable_category if empty
        const catCount = await ConsumableCategory.count();
        if (catCount === 0) {
            await ConsumableCategory.bulkCreate([
                { category_name: 'Cairan Kimia' },
                { category_name: 'Alat Pelindung Dini' },
                { category_name: 'Alat Gelas' },
                { category_name: 'Lain-lain' }
            ]);
            console.log('Seeded default BHP categories');
        }

        // 3. Seed consumable if empty
        const consumableCount = await Consumable.count();
        if (consumableCount === 0) {
            const firstCat = await ConsumableCategory.findOne();
            const catId = firstCat ? firstCat.id : 1;
            
            await Consumable.bulkCreate([
                {
                    category_id: catId,
                    consumable_code: 'BHP-ALK-70',
                    consumable_name: 'Alkohol 70%',
                    unit: 'Botol',
                    stock: 10,
                    minimum_stock: 2,
                    latest_price: 35000.00,
                    storage_location: 'Lemari Bahan Kimia',
                    is_active: 1
                },
                {
                    category_id: catId + 1, // APD
                    consumable_code: 'BHP-MSK-MED',
                    consumable_name: 'Masker Medis',
                    unit: 'Box',
                    stock: 50,
                    minimum_stock: 5,
                    latest_price: 45000.00,
                    storage_location: 'Laci APD',
                    is_active: 1
                },
                {
                    category_id: catId + 1, // APD
                    consumable_code: 'BHP-ST-LAT',
                    consumable_name: 'Sarung Tangan Latex',
                    unit: 'Box',
                    stock: 30,
                    minimum_stock: 5,
                    latest_price: 60000.00,
                    storage_location: 'Laci APD',
                    is_active: 1
                }
            ]);
            console.log('Seeded default BHP items');
        }
    } catch (e) {
        console.error('Error seeding BHP initial data:', e);
    }
};

// Execute Seeder
ensureInitialData();

const consumableController = {
    // List all consumables
    index: async (req, res) => {
        try {
            await ensureInitialData(); // ensure directories/data exist
            const consumables = await sequelize.query(
                `
                SELECT c.*, cc.category_name
                FROM consumable c
                LEFT JOIN consumable_category cc ON c.category_id = cc.id
                ORDER BY c.id DESC
                `,
                { type: QueryTypes.SELECT }
            );

            res.render('consumables/index', {
                title: 'Kelola Stok BHP',
                consumables
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Render form to add new consumable item
    create: async (req, res) => {
        try {
            const categories = await ConsumableCategory.findAll();
            res.render('consumables/create', {
                title: 'Tambah Katalog BHP',
                categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Save new consumable item to database
    store: async (req, res) => {
        try {
            const {
                category_id,
                consumable_code,
                consumable_name,
                unit,
                stock,
                minimum_stock,
                latest_price,
                storage_location
            } = req.body;

            // Check uniqueness of code if provided
            if (consumable_code) {
                const codeExists = await Consumable.findOne({ where: { consumable_code } });
                if (codeExists) {
                    return res.status(400).send('Kode BHP sudah digunakan.');
                }
            }

            const parsedStock = parseInt(stock, 10) || 0;

            const newConsumable = await Consumable.create({
                category_id: category_id || null,
                consumable_code: consumable_code || null,
                consumable_name,
                unit,
                stock: parsedStock,
                minimum_stock: parseInt(minimum_stock, 10) || 0,
                latest_price: parseFloat(latest_price) || 0.00,
                storage_location: storage_location || '',
                is_active: 1
            });

            // Log stock movement for initial stock
            if (parsedStock > 0) {
                await StockMovement.create({
                    consumable_id: newConsumable.id,
                    movement_type: 'MASUK',
                    quantity: parsedStock,
                    reference_type: 'PENYESUAIAN_MANUAL',
                    notes: 'Stok awal pendaftaran barang',
                    created_by: req.session.user.id
                });
            }

            res.redirect('/consumables');
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    },

    // Handle manual stock adjustments (in/out)
    adjustStock: async (req, res) => {
        try {
            const consumableId = req.params.id;
            const { movement_type, quantity, notes } = req.body;
            const qty = parseInt(quantity, 10);

            const consumable = await Consumable.findByPk(consumableId);
            if (!consumable) {
                return res.status(404).send('BHP tidak ditemukan.');
            }

            if (isNaN(qty) || qty <= 0) {
                return res.status(400).send('Jumlah penyesuaian tidak valid.');
            }

            let newStock = consumable.stock;
            if (movement_type === 'MASUK') {
                newStock += qty;
            } else if (movement_type === 'KELUAR') {
                if (qty > consumable.stock) {
                    return res.status(400).send('Stok tidak mencukupi untuk pengurangan.');
                }
                newStock -= qty;
            } else {
                return res.status(400).send('Tipe pergerakan tidak valid.');
            }

            await consumable.update({ stock: newStock });

            // Create stock movement record
            await StockMovement.create({
                consumable_id: consumableId,
                movement_type,
                quantity: qty,
                reference_type: 'PENYESUAIAN_MANUAL',
                notes: notes || 'Penyesuaian manual stok',
                created_by: req.session.user.id
            });

            res.redirect('/consumables');
        } catch (error) {
            console.error(error);
            res.status(500).send(`Error Server: ${error.message}`);
        }
    }
};

module.exports = consumableController;
