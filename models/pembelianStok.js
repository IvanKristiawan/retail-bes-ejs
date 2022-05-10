const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pembelianStokSchema = new Schema({
    nomorNota: {type: String},
    tanggal: {type: Date},
    jenis: {type: String},
    kodeSupplier: {type: String},
    total: {type: Number},
})

module.exports = mongoose.model('PembelianStok', pembelianStokSchema);