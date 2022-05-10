const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const penjualanStokSchema = new Schema({
    nomorNota: {type: String},
    tanggal: {type: Date},
    jenis: {type: String},
    total: {type: Number},
})

module.exports = mongoose.model('PenjualanStok', penjualanStokSchema);