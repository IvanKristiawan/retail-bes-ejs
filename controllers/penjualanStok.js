// Import Models
const PenjualanStok = require('../models/penjualanStok');
const APenjualanStok = require('../models/apenjualanStok');
const Stok = require('../models/stok');
const Supplier = require('../models/supplier'); 

module.exports.index = async(req, res) => {
    const penjualanStoks = await PenjualanStok.find({});
    const suppliers = await Supplier.find({});
    res.render('penjualanStok/penjualanStok/index', {penjualanStoks, suppliers});
}

module.exports.penjualanStokSearch = async(req, res) => {
    const {nomorNota} = req.body;
    const suppliers = await Supplier.find({});
    const penjualanStoks = await PenjualanStok.find({nomorNota: {$regex: nomorNota}});
    res.render('penjualanStok/penjualanStok/index', {penjualanStoks, suppliers});
}

module.exports.penjualanStokNewPage = async(req, res) => {
    const timeID = new Date();
    const getYear = timeID.getFullYear();
    const getMonth = timeID.getMonth() + 1;
    const getDate = timeID.getDate();
    const timeIDDate = getDate+'/'+getMonth+'/'+getYear;
    const suppliers = await Supplier.find({});
    res.render('penjualanStok/penjualanStok/new', {timeID, timeIDDate, suppliers});
}

module.exports.penjualanStokUpload = async(req, res) => {
    const newPenjualanStok = new PenjualanStok(req.body);
    await newPenjualanStok.save();
    res.redirect(`/penjualanStok`);
}

module.exports.penjualanStokShowPage = async(req, res) => {
    let tempTotal = 0;
    const stoks = await Stok.find({});
    const suppliers = await Supplier.find({});
    const {id} = req.params;
    const penjualanStok = await PenjualanStok.findOne({nomorNota: id});
    const ApenjualanStoks = await APenjualanStok.find({nomorNota: penjualanStok.nomorNota});
    for(let ApenjualanStok of ApenjualanStoks){
        tempTotal += ApenjualanStok.subtotal;
    }
    await PenjualanStok.findOneAndUpdate({nomorNota: id}, {$set:{total:tempTotal, default: 0}});
    res.render('penjualanStok/penjualanStok/show', {ApenjualanStoks, penjualanStok, suppliers, stoks});
}

module.exports.penjualanStokEditPage = async(req, res) => {
    const {id} = req.params;
    const penjualanStok = await PenjualanStok.findOne({nomorNota: id});
    const timeID = new Date();
    const getYear = timeID.getFullYear();
    const getMonth = timeID.getMonth() + 1;
    const getDate = timeID.getDate();
    const timeIDDate = getDate+'/'+getMonth+'/'+getYear;
    const suppliers = await Supplier.find({});
    res.render('penjualanStok/penjualanStok/edit', {penjualanStok, timeID, timeIDDate, suppliers});
}

module.exports.penjualanStokEdit = async(req, res) => {
    const {id} = req.params;
    const penjualanStok = await PenjualanStok.findOneAndUpdate({nomorNota: id}, req.body, {runValidators: true, new: true});
    res.redirect(`/penjualanStok/${penjualanStok.nomorNota}`);
}

module.exports.penjualanStokDelete = async(req, res) => {
    let tempQty = 0;
    const stoks = await Stok.find({});
    const {id} = req.params;
    const findAPenjualan = await APenjualanStok.find({nomorNota: id});
    for(let stok of stoks){
        for(let newAPenjualanStok of findAPenjualan) {
            if(stok.kode == newAPenjualanStok.kodeStok){
                tempQty = stok.qty;
                tempQty += newAPenjualanStok.qty;
                await Stok.findOneAndUpdate({kode: newAPenjualanStok.kodeStok}, {$set:{qty:tempQty}});
            }
        }
    }
    const deletedAPenjualan = await APenjualanStok.deleteMany({nomorNota: id});
    const deletedPenjualanStok = await PenjualanStok.findOneAndDelete({nomorNota: id});
    res.redirect('/penjualanStok/');
}

// Routing aPenjualan Stok
module.exports.apenjualanStokNewPage = async(req, res) => {
    const {id} = req.params;
    const kodeStok = '';
    const penjualanStok = await PenjualanStok.findOne({nomorNota: id});
    const stoks = await Stok.find({});
    res.render('penjualanStok/apenjualanStok/new', {id, penjualanStok, stoks, kodeStok});
}

module.exports.apenjualanStokUpload = async(req, res) => {
    let tempSubTotal = 0;
    let tempQty = 0;
    const {id} = req.params;
    const stoks = await Stok.find({});
    let newAPenjualanStok = new APenjualanStok(req.body);
    await newAPenjualanStok.save();
    tempSubTotal = (newAPenjualanStok.hargaSatuan * newAPenjualanStok.qty)-(newAPenjualanStok.hargaSatuan * newAPenjualanStok.qty * newAPenjualanStok.potongan / 100);
    newAPenjualanStok = await APenjualanStok.findOneAndUpdate({nomorNota: newAPenjualanStok.nomorNota, kodeStok: newAPenjualanStok.kodeStok}, {$set:{subtotal:tempSubTotal}});
    for(let stok of stoks){
        if(stok.kode == newAPenjualanStok.kodeStok){
            tempQty = stok.qty;
            tempQty -= newAPenjualanStok.qty;
            await Stok.findOneAndUpdate({kode: newAPenjualanStok.kodeStok}, {$set:{qty:tempQty}});
        }
    }
    res.redirect(`/penjualanStok/${id}`);
}

module.exports.apenjualanStokShowPage = async(req, res) => {
    const {id} = req.params;
    const {idStok} = req.params;
    const penjualanStok = await PenjualanStok.findOne({nomorNota: id});
    const apenjualanStok = await APenjualanStok.findOne({kodeStok: idStok});
    const stoks = await Stok.find({});
    res.render('penjualanStok/apenjualanStok/edit', {stoks, id, apenjualanStok, penjualanStok});
}

module.exports.apenjualanStokEdit = async(req, res) => {
    const {id} = req.params;
    const {idStok} = req.params;
    const apenjualanStok = await APenjualanStok.findOneAndUpdate({kodeStok: idStok}, req.body, {runValidators: true, new: true});
    res.redirect(`/penjualanStok/${id}`);
}

module.exports.apenjualanStokDelete = async(req, res) => {
    let tempQty = 0;
    const {id} = req.params;
    const {idStok} = req.params;
    const deletedapenjualanStok = await APenjualanStok.findOneAndDelete({kodeStok: idStok, nomorNota: id});
    const stoks = await Stok.find({});
    for(let stok of stoks){
        if(stok.kode == deletedapenjualanStok.kodeStok){
            tempQty = stok.qty;
            tempQty += deletedapenjualanStok.qty;
            await Stok.findOneAndUpdate({kode: deletedapenjualanStok.kodeStok}, {$set:{qty:tempQty}});
        }
    }
    res.redirect(`/penjualanStok/${id}`);
}

module.exports.searchStok = async(req, res) => {
    const {id} = req.params;
    const {namaStok} = req.body;
    const stoks = await Stok.find({namaStok: {$regex: namaStok.toUpperCase()}});
    res.render('penjualanStok/penjualanStok/searchStok', {id, stoks});
}

module.exports.sendSearchedStok = async(req, res) => {
    const {id} = req.params;
    const {kodeStok} = req.body;
    const penjualanStok = await PenjualanStok.findOne({nomorNota: id});
    const stoks = await Stok.find({});
    res.render('penjualanStok/apenjualanStok/new', {id, penjualanStok, stoks, kodeStok});
}