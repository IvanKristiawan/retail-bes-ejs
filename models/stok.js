const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const stokSchema = new Schema({
    images: [ImageSchema],
    kode: {type: String},
    namaStok: {type: String},
    merk: {type: String},
    satuanKecil: {type: String},
    satuanBesar: {type: String},
    konversi: {type: Number},
    qty: {type: Number, default: 0},
    hargaJualKecil: {type: Number},
    hargaJualBesar: {type: Number},
    kodeGrup: {type: String},
})

module.exports = mongoose.model('Stok', stokSchema);