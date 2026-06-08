require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const sequelize = require('./config/database');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'yoursecret',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     maxAge: 1000 * 60 * 60 * 2
    // }
}))


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ROOT ROUTE
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

// ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const procurementItemRoutes = require('./routes/procurementItemRoutes');
const reviewProcurementRoutes = require('./routes/reviewProcurementRoutes');

app.use(roomRoutes)
app.use(userRoutes)
app.use(authRoutes)
app.use(dashboardRoutes)
app.use(procurementRoutes)
app.use(procurementItemRoutes);
app.use(reviewProcurementRoutes);

app.use((req, res) => {
    res.status(404).render('errors/404');
});

const PORT = process.env.PORT || 3000;
sequelize.sync({alter: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        })
    })
    .catch(err => console.log(err))
