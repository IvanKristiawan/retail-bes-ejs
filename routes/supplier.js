const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Import Controllers
const supplier = require('../controllers/supplier');

// Routing Supplier
router.route('/')
    .get(supplier.index)
    .post(catchAsync(supplier.uploadSupplier));
router.post('/search', catchAsync(supplier.searchSupplier));
router.get('/new', supplier.newPage);
router.route('/:id')
    .get(catchAsync(supplier.showSupplier))
    .put(catchAsync(supplier.editSupplier))
    .delete(catchAsync(supplier.deleteSupplier));
router.get('/:id/edit', catchAsync(supplier.editPage));

module.exports = router;