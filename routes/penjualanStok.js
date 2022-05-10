const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Import Controllers
const penjualanStok = require('../controllers/penjualanStok');

// Routing Index
router.route('/')
    .get(penjualanStok.index)
    .post(catchAsync(penjualanStok.penjualanStokUpload));
router.post('/search', catchAsync(penjualanStok.penjualanStokSearch));
router.get('/new', penjualanStok.penjualanStokNewPage);
router.route('/:id')
    .get(catchAsync(penjualanStok.penjualanStokShowPage))
    .put(catchAsync(penjualanStok.penjualanStokEdit))
    .delete(catchAsync(penjualanStok.penjualanStokDelete));
router.get('/:id/edit', catchAsync(penjualanStok.penjualanStokEditPage));

// Routing a Penjualan Stok
router.route('/:id/newa')
    .get(catchAsync(penjualanStok.apenjualanStokNewPage))
    .post(catchAsync(penjualanStok.apenjualanStokUpload));
router.route('/:id/:idStok')
    .get(catchAsync(penjualanStok.apenjualanStokShowPage))
    .put(catchAsync(penjualanStok.apenjualanStokEdit))
    .delete(catchAsync(penjualanStok.apenjualanStokDelete));
router.post('/:id/searchStok', catchAsync(penjualanStok.searchStok));
router.post('/:id/newaSearch', catchAsync(penjualanStok.sendSearchedStok));

module.exports = router;