const Room = require('../models/Room');
const User = require('../models/User');
// const ActivityLog = require('../models/ActivityLog');

module.exports = {
    index: async (req, res) => {
        try {
            const user = req.user;
            const role = user.role_name;

            let data = {
                pageTitle: 'Dashboard',
                user
            };
            console.log("ROLE:", req.user.role_name);
            console.log("DASH DATA:", data);


            // =====================
            // ADMIN DASHBOARD
            // =====================
            if (user.role_name === 'ADMIN') {
                data.totalUsers = await User.count();
                data.activeUsers = await User.count({
                    where: { is_active: 1 }
                });
                data.totalRooms = await Room.count();
            }

            // =====================
            // LAB STAFF
            // =====================
            if (role === 'lab_staff') {
                data.totalRooms = await Room.count();
            }

            // =====================
            // ACTIVITY LOG (SEMUA ROLE)
            // =====================
            // data.activities = await ActivityLog.findAll({
            //     order: [['created_at', 'DESC']],
            //     limit: 10
            // });

            res.render('dashboard/index', data);

        } catch (error) {
            console.log(error);
            res.send('Database Error');
        }
    }
};