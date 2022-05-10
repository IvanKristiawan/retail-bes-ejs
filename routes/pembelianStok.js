const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Import Controllers
const pembelianStok = require('../controllers/pembelianStok');

// Routing Index
router.route('/')
    .get(pembelianStok.index)
    .post(catchAsync(pembelianStok.pembelianStokUpload));
router.get('/new', pembelianStok.pembelianStoknewPage);
router.post('/search', catchAsync(pembelianStok.pembelianStokSearch));
router.route('/:id')
    .get(catchAsync(pembelianStok.pembelianStokShowPage))
    .put(catchAsync(pembelianStok.pembelianStokEdit))
    .delete(catchAsync(pembelianStok.pembelianStokDelete))
router.get('/:id/edit', catchAsync(pembelianStok.pembelianStokEditPage));

// Routing a Pembelian Stok
router.route('/:id/newa')
    .get(catchAsync(pembelianStok.apembelianStokNewPage))
    .post(catchAsync(pembelianStok.apembelianStokUpload));
router.route('/:id/:idStok')
    .get(catchAsync(pembelianStok.apembelianStokShowPage))
    .put(catchAsync(pembelianStok.apembelianStokEdit))
    .delete(catchAsync(pembelianStok.apembelianStokDelete));
router.post('/:id/searchStok', catchAsync(pembelianStok.searchStok));
router.post('/:id/newaSearch', catchAsync(pembelianStok.sendSearchedStok));

module.exports = router;