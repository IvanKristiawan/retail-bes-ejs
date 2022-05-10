const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apembelianStokSchema = new Schema({
    nomorNota: {type: String},
    kodeStok: {type: String},
    qty: {type: Number},
    hargaSatuan: {type: Number},
    potongan: {type: Number},
    subtotal: {type: Number},
})

module.exports = mongoose.model('APembelianStok', apembelianStokSchema);