// Import Models
const GroupStok = require('../models/groupStok');
const Stok = require('../models/stok');
const {cloudinary} = require('../cloudinary');

// Routing Index Stok
module.exports.index = async(req, res) => {
    res.render('stok/index');
}

// Routing Group Stok
module.exports.groupStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    let tempLowI = 0;
    let tempUpI = 20;
    res.render('stok/groupStok/index', {groupStoks, tempLowI, tempUpI});
}

module.exports.groupStokSearch = async(req, res) => {
    const inputGroupStok = new GroupStok(req.body);
    const tempGroupStok = inputGroupStok.namaGroup.toUpperCase();
    const groupStoks = await GroupStok.find({namaGroup:{$regex: tempGroupStok}});
    let tempLowI = 0;
    let tempUpI = 20;
    res.render('stok/groupStok/index', {groupStoks, tempLowI, tempUpI});
}

module.exports.groupStokNewPage = async(req, res) => {
    res.render('stok/groupStok/new');
}

module.exports.groupStokUpload = async(req, res) => {
    const newGroupStok = new GroupStok(req.body);
    await newGroupStok.save();
    res.redirect(`/stoks/groupStok`);
}

module.exports.groupStokShowPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    const {id} = req.params;
    const groupStok = await GroupStok.findById(id);
    res.render('stok/groupStok/show', {groupStoks, groupStok});
}

module.exports.groupStokEditPage = async(req, res) => {
    const {id} = req.params;
    const groupStok = await GroupStok.findById(id);
    res.render('stok/groupStok/edit', {groupStok});
}

module.exports.groupStokEdit = async(req, res) => {
    const {id} = req.params;
    const groupStok = await GroupStok.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/stoks/groupStok/${groupStok._id}`);
}

module.exports.groupStokDelete = async(req, res) => {
    const {id} = req.params;
    const deletedGroupStok = await GroupStok.findByIdAndDelete(id);
    res.redirect('/stoks/groupStok');
}

module.exports.groupStokNext = async(req, res) => {
    const {lowI} = req.body;
    const {upI} = req.body;
    const groupStoks = await GroupStok.find({}).sort({kode:1});
    let tempLowI = parseInt(lowI)+20;
    let tempUpI = parseInt(upI)+20;
    res.render('stok/groupStok/index', {groupStoks, tempLowI, tempUpI});
}

module.exports.groupStokPrevious = async(req, res) => {
    const {lowI} = req.body;
    const {upI} = req.body;
    const groupStoks = await GroupStok.find({}).sort({kode:1});
    let tempLowI = parseInt(lowI)-20;
    let tempUpI = parseInt(upI)-20;
    res.render('stok/groupStok/index', {groupStoks, tempLowI, tempUpI});
}

// Routing Stok
module.exports.stokPage = async(req, res) => {
    const stoks = await Stok.find({}).sort({kode:1});
    let tempLowI = 0;
    let tempUpI = 20;
    res.render('stok/stok/index', {stoks, tempLowI, tempUpI});
}

module.exports.stokSearch = async(req, res) => {
    const inputStok = new Stok(req.body);
    const tempStok = inputStok.namaStok.toUpperCase();
    const stoks = await Stok.find({namaStok:{$regex: tempStok}});
    let tempLowI = 0;
    let tempUpI = 20;
    res.render('stok/stok/index', {stoks, tempLowI, tempUpI});
}

module.exports.stokNewPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    res.render('stok/stok/new', {groupStoks});
}

module.exports.stokUpload = async(req, res) => {
    const newStok = new Stok(req.body);
    newStok.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await newStok.save();
    res.redirect(`/stoks/stok`);
}

module.exports.stokShowPage = async(req, res) => {
    const stoks = await Stok.find({}).sort({kode:1});
    const {id} = req.params;
    const stok = await Stok.findById(id);
    const findGroupStok = await GroupStok.findOne({kode: stok.kodeGrup});
    res.render('stok/stok/show', {stoks, stok, findGroupStok});
}

module.exports.stokEditPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    const {id} = req.params;
    const stok = await Stok.findById(id);
    res.render('stok/stok/edit', {stok, groupStoks});
}

module.exports.stokEdit = async(req, res) => {
    const stoks = await Stok.find({});
    const {id} = req.params;
    const stok = await Stok.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    const findGroupStok = await GroupStok.findOne({kode: stok.kodeGrup});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    stok.images.push(...imgs);
    await stok.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await stok.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    res.render('stok/stok/show', {stoks, stok, findGroupStok});
}

module.exports.stokDelete = async(req, res) => {
    const {id} = req.params;
    const stok = await Stok.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await stok.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    const deletedStok = await Stok.findByIdAndDelete(id);
    res.redirect('/stoks/stok');
}

module.exports.stokNext = async(req, res) => {
    const {lowI} = req.body;
    const {upI} = req.body;
    const stoks = await Stok.find({}).sort({kode:1});
    let tempLowI = parseInt(lowI)+20;
    let tempUpI = parseInt(upI)+20;
    res.render('stok/stok/index', {stoks, tempLowI, tempUpI});
}

module.exports.stokPrevious = async(req, res) => {
    const {lowI} = req.body;
    const {upI} = req.body;
    const stoks = await Stok.find({}).sort({kode:1});
    let tempLowI = parseInt(lowI)-20;
    let tempUpI = parseInt(upI)-20;
    res.render('stok/stok/index', {stoks, tempLowI, tempUpI});
}