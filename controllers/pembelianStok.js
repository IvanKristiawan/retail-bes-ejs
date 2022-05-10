// Import Models
const PembelianStok = require('../models/pembelianStok');
const APembelianStok = require('../models/apembelianStok');
const Stok = require('../models/stok');
const Supplier = require('../models/supplier'); 

module.exports.index = async(req, res) => {
    const pembelianStoks = await PembelianStok.find({});
    const suppliers = await Supplier.find({});
    res.render('pembelianStok/pembelianStok/index', {pembelianStoks, suppliers});
}

module.exports.pembelianStokSearch = async(req, res) => {
    const {nomorNota} = req.body;
    const suppliers = await Supplier.find({});
    const pembelianStoks = await PembelianStok.find({nomorNota: nomorNota});
    res.render('pembelianStok/pembelianStok/index', {pembelianStoks, suppliers});
}

module.exports.pembelianStoknewPage = async(req, res) => {
    const timeID = new Date();
    const getYear = timeID.getFullYear();
    const getMonth = timeID.getMonth() + 1;
    const getDate = timeID.getDate();
    const timeIDDate = getDate+'/'+getMonth+'/'+getYear;
    const suppliers = await Supplier.find({});
    res.render('pembelianStok/pembelianStok/new', {timeID, timeIDDate, suppliers});
}

module.exports.pembelianStokUpload = async(req, res) => {
    const newPembelianStok = new PembelianStok(req.body);
    await newPembelianStok.save();
    res.redirect(`/pembelianStok`);
}

module.exports.pembelianStokShowPage = async(req, res) => {
    let tempTotal = 0;
    const stoks = await Stok.find({});
    const suppliers = await Supplier.find({});
    const {id} = req.params;
    const pembelianStok = await PembelianStok.findOne({nomorNota: id});
    const ApembelianStoks = await APembelianStok.find({nomorNota: pembelianStok.nomorNota});
    for(let ApembelianStok of ApembelianStoks){
        tempTotal += ApembelianStok.subtotal;
    }
    await PembelianStok.findOneAndUpdate({nomorNota: id}, {$set:{total:tempTotal, default: 0}});
    res.render('pembelianStok/pembelianStok/show', {ApembelianStoks, pembelianStok, suppliers, stoks});
}

module.exports.pembelianStokEditPage = async(req, res) => {
    const {id} = req.params;
    const pembelianStok = await PembelianStok.findOne({nomorNota: id});
    const timeID = new Date();
    const getYear = timeID.getFullYear();
    const getMonth = timeID.getMonth() + 1;
    const getDate = timeID.getDate();
    const timeIDDate = getDate+'/'+getMonth+'/'+getYear;
    const suppliers = await Supplier.find({});
    res.render('pembelianStok/pembelianStok/edit', {pembelianStok, timeID, timeIDDate, suppliers});
}

module.exports.pembelianStokEdit = async(req, res) => {
    const {id} = req.params;
    const pembelianStok = await PembelianStok.findOneAndUpdate({nomorNota: id}, req.body, {runValidators: true, new: true});
    res.redirect(`/pembelianStok/${pembelianStok.nomorNota}`);
}

module.exports.pembelianStokDelete = async(req, res) => {
    let tempQty = 0;
    const stoks = await Stok.find({});
    const {id} = req.params;
    const findAPembelian = await APembelianStok.find({nomorNota: id});
    for(let stok of stoks){
        for(let newAPembelianStok of findAPembelian) {
            if(stok.kode == newAPembelianStok.kodeStok){
                tempQty = stok.qty;
                tempQty -= newAPembelianStok.qty;
                await Stok.findOneAndUpdate({kode: newAPembelianStok.kodeStok}, {$set:{qty:tempQty}});
            }
        }
    }
    const deletedAPembelian = await APembelianStok.deleteMany({nomorNota: id});
    const deletedPembelianStok = await PembelianStok.findOneAndDelete({nomorNota: id});
    res.redirect('/pembelianStok/');
}

// Routing aPembelian Stok
module.exports.apembelianStokNewPage = async(req, res) => {
    const {id} = req.params;
    const kodeStok = '';
    const pembelianStok = await PembelianStok.findOne({nomorNota: id});
    const stoks = await Stok.find({});
    res.render('pembelianStok/apembelianStok/new', {id, pembelianStok, stoks, kodeStok});
}

module.exports.apembelianStokUpload = async(req, res) => {
    let tempSubTotal = 0;
    let tempQty = 0;
    const {id} = req.params;
    const stoks = await Stok.find({});
    let newAPembelianStok = new APembelianStok(req.body);
    await newAPembelianStok.save();
    tempSubTotal = (newAPembelianStok.hargaSatuan * newAPembelianStok.qty)-(newAPembelianStok.hargaSatuan * newAPembelianStok.qty * newAPembelianStok.potongan / 100);
    newAPembelianStok = await APembelianStok.findOneAndUpdate({nomorNota: newAPembelianStok.nomorNota, kodeStok: newAPembelianStok.kodeStok}, {$set:{subtotal:tempSubTotal}});
    for(let stok of stoks){
        if(stok.kode == newAPembelianStok.kodeStok){
            tempQty = stok.qty;
            tempQty += newAPembelianStok.qty;
            await Stok.findOneAndUpdate({kode: newAPembelianStok.kodeStok}, {$set:{qty:tempQty}});
        }
    }
    res.redirect(`/pembelianStok/${id}`);
}

module.exports.apembelianStokShowPage = async(req, res) => {
    const {id} = req.params;
    const {idStok} = req.params;
    const pembelianStok = await PembelianStok.findOne({nomorNota: id});
    const apembelianStok = await APembelianStok.findOne({kodeStok: idStok});
    const stoks = await Stok.find({});
    res.render('pembelianStok/apembelianStok/edit', {stoks, id, apembelianStok, pembelianStok});
}

module.exports.apembelianStokEdit = async(req, res) => {
    const {id} = req.params;
    const {idStok} = req.params;
    const apembelianStok = await APembelianStok.findOneAndUpdate({kodeStok: idStok}, req.body, {runValidators: true, new: true});
    res.redirect(`/pembelianStok/${id}`);
}

module.exports.apembelianStokDelete = async(req, res) => {
    let tempQty = 0;
    const {id} = req.params;
    const {idStok} = req.params;
    const deletedapembelianStok = await APembelianStok.findOneAndDelete({kodeStok: idStok, nomorNota: id});
    const stoks = await Stok.find({});
    for(let stok of stoks){
        if(stok.kode == deletedapembelianStok.kodeStok){
            tempQty = stok.qty;
            tempQty -= deletedapembelianStok.qty;
            await Stok.findOneAndUpdate({kode: deletedapembelianStok.kodeStok}, {$set:{qty:tempQty}});
        }
    }
    res.redirect(`/pembelianStok/${id}`);
}

module.exports.searchStok = async(req, res) => {
    const {id} = req.params;
    const {namaStok} = req.body;
    const stoks = await Stok.find({namaStok: {$regex: namaStok.toUpperCase()}});
    res.render('pembelianStok/pembelianStok/searchStok', {id, stoks});
}

module.exports.sendSearchedStok = async(req, res) => {
    const {id} = req.params;
    const {kodeStok} = req.body;
    const pembelianStok = await PembelianStok.findOne({nomorNota: id});
    const stoks = await Stok.find({});
    res.render('pembelianStok/apembelianStok/new', {id, pembelianStok, stoks, kodeStok});
}