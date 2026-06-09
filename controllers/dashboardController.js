const Room = require('../models/Room');
const User = require('../models/User');
const ProcurementDraft = require('../models/ProcurementDraft');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = {
    index: async (req, res) => {
        try {
            const user = req.user;
            const roleRaw = (user && user.role_name) ? user.role_name : null;
            const role = roleRaw ? roleRaw.toString() : null;

            console.log('detected roleRaw:', roleRaw, 'normalized role:', role);

            let data = {
                pageTitle: 'Dashboard',
                user
            };
            console.log("ROLE:", req.user ? req.user.role_name : null);
            console.log("DASH DATA:", data);

            // =====================
            // ADMIN DASHBOARD
            // =====================
            if (user && user.role_name === 'ADMIN') {
                data.totalUsers = await User.count();
                data.activeUsers = await User.count({
                    where: { is_active: 1 }
                });
                data.totalRooms = await Room.count();
            }

            // =====================
            // KEPALA LAB DASHBOARD (robust check)
            // =====================
            if (role && role.toUpperCase().includes('KEPALA')) {
                try {
                    // Ambil semua procurement yang sudah diajukan (status != DRAF)
                    data.procurements = await sequelize.query(
                        `
                            SELECT
                                pd.*,
                                u.full_name as created_by_name,
                                COUNT(pi.id) as total_items,
                                COALESCE(SUM(pi.total_price), 0) as grand_total
                            FROM procurement_draft pd
                                     JOIN user u ON pd.created_by = u.id
                                     LEFT JOIN procurement_item pi ON pd.id = pi.draft_id
                            WHERE TRIM(COALESCE(pd.draft_status, '')) != 'DRAF'
                            GROUP BY pd.id
                            ORDER BY pd.updated_at DESC
                        `,
                        {
                            type: QueryTypes.SELECT,
                        }
                    );

                    data.totalProcurements = data.procurements.length;
                    data.submittedCount = data.procurements.filter(p => p.draft_status === 'DIAJUKAN').length;
                    data.reviewingCount = data.procurements.filter(p => p.draft_status === 'SEDANG_DIREVIEW').length;
                    data.lockedCount = data.procurements.filter(p => p.draft_status === 'TERKUNCI').length;

                    console.log('Procurements.length =', data.procurements.length);
                    console.log('Procurements sample:', data.procurements.slice(0,3));
                } catch (queryError) {
                    console.error('Query error:', queryError);
                    data.procurements = [];
                }
            }

            // =====================
            // KAPRODI DASHBOARD
            //  - Mirip dengan KEPALA, tetapi UANG (grand total) hanya ditampilkan
            //    untuk draft yang sudah `TERKUNCI`. Kita tetap ambil daftar pengadaan
            //    untuk ditampilkan, namun menghitung total uang dari yang TERKUNCI.
            // =====================
            if (role && role.toUpperCase().includes('KAPRODI')) {
                try {
                    // Ambil daftar procurement (sama query seperti Kepala Lab)
                    data.procurements = await sequelize.query(
                        `
                            SELECT
                                pd.*,
                                u.full_name as created_by_name,
                                COUNT(pi.id) as total_items,
                                COALESCE(SUM(pi.total_price), 0) as grand_total
                            FROM procurement_draft pd
                                     JOIN user u ON pd.created_by = u.id
                                     LEFT JOIN procurement_item pi ON pd.id = pi.draft_id
                            WHERE TRIM(COALESCE(pd.draft_status, '')) != 'DRAF'
                            GROUP BY pd.id
                            ORDER BY pd.updated_at DESC
                        `,
                        {
                            type: QueryTypes.SELECT,
                        }
                    );

                    // Hitung statistik umum juga (opsional, mirip Kepala Lab)
                    data.totalProcurements = data.procurements.length;
                    data.submittedCount = data.procurements.filter(p => p.draft_status === 'DIAJUKAN').length;
                    data.reviewingCount = data.procurements.filter(p => p.draft_status === 'SEDANG_DIREVIEW').length;
                    data.lockedCount = data.procurements.filter(p => p.draft_status === 'TERKUNCI').length;

                    // TOTAL UANG: hanya jumlah grand_total dari procurement yang TERKUNCI
                    const lockedMoney = data.procurements
                        .filter(p => p.draft_status === 'TERKUNCI')
                        .reduce((sum, p) => sum + Number(p.grand_total || 0), 0);

                    data.totalLockedMoney = lockedMoney;

                    // flag untuk view
                    data.isKaprodi = true;

                } catch (queryError) {
                    console.error('Query error (Kaprodi):', queryError);
                    data.procurements = [];
                    data.totalLockedMoney = 0;
                    data.isKaprodi = true;
                }
            }

            // =====================
            // LAB STAFF
            // =====================
            if (role && role.toUpperCase().includes('STAFF')) {
                data.totalRooms = await Room.count();
            }

            res.render('dashboard/index', data);

        } catch (error) {
            console.log(error);
            res.send('Database Error');
        }
    }
};
