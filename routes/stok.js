const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Import Controllers
const stok = require('../controllers/stok');

// Require Multer for Img Upload
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

// Routing Stok Index
router.get('/', stok.index);

// Routing Group Stok
router.route('/groupStok')
    .get(stok.groupStokPage)
    .post(catchAsync(stok.groupStokUpload));
router.post('/groupStok/search', catchAsync(stok.groupStokSearch));
router.get('/groupStok/new', stok.groupStokNewPage);
router.route('/groupStok/:id')
    .get(catchAsync(stok.groupStokShowPage))
    .put(catchAsync(stok.groupStokEdit))
    .delete(catchAsync(stok.groupStokDelete))
router.get('/groupStok/:id/edit', catchAsync(stok.groupStokEditPage));
router.post('/groupStok/next', catchAsync(stok.groupStokNext));
router.post('/groupStok/previous', catchAsync(stok.groupStokPrevious));


// Routing Stok
router.route('/stok')
    .get(stok.stokPage)
    .post(upload.array('image'), catchAsync(stok.stokUpload));
router.post('/stok/search', catchAsync(stok.stokSearch));
router.get('/stok/new', stok.stokNewPage);
router.route('/stok/:id')
    .get(catchAsync(stok.stokShowPage))
    .put(upload.array('image'), catchAsync(stok.stokEdit))
    .delete(catchAsync(stok.stokDelete));
router.get('/stok/:id/edit', catchAsync(stok.stokEditPage));
router.post('/stok/next', catchAsync(stok.stokNext));
router.post('/stok/previous', catchAsync(stok.stokPrevious));

module.exports = router;