const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    kode: { type: String },
    namaSupplier: { type: String },
    alamatSupplier: { type: String },
    kota: { type: String },
    telp: { type: String },
    npwp: { type: String },
})

module.exports = mongoose.model('Supplier', SupplierSchema);