// Init Package
const express = require('express');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const ExpressError = require('./utils/ExpressError');

// Import Routes
const supplierRoutes = require('./routes/supplier');
const stokRoutes = require('./routes/stok');
const pembelianStokRoutes = require('./routes/pembelianStok');
const penjualanStokRoutes = require('./routes/penjualanStok');

// end Init Package

dotenv.config();

// Mongoose Started
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DBConnection Successfull!"))
    .catch((err) => console.log(err));
// end Mongoose Started

// Set Package
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// end Set Package

// Use Package
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// end Use Package

// Routing
app.use('/suppliers', supplierRoutes);
app.use('/stoks', stokRoutes);
app.use('/pembelianStok', pembelianStokRoutes);
app.use('/penjualanStok', penjualanStokRoutes);

// Routing Main Index
app.get('/', async(req, res) => {
    res.render('index');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', {err});
})

// Use Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}`);
});
// end Use Port