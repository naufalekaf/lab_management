exports.isAdmin = (req, res, next) => {
    if (req.session.user.role_name !== 'ADMIN') {
        return res.send('Access Denied');
    }

    next();
};