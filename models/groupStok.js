const mongoose = require('mongoose');

const GroupStokSchema = new mongoose.Schema({
    kode: {type: String},
    namaGroup: {type: String},
})

module.exports = mongoose.model('GroupStok', GroupStokSchema);