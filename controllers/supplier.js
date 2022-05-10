// Import Models
const Supplier = require('../models/supplier');

module.exports.index = async(req, res) => {
    const suppliers = await Supplier.find({});
    res.render('suppliers/index', {suppliers});
}

module.exports.searchSupplier = async(req, res) => {
    const inputSupplier = new Supplier(req.body);
    const tempSupplier = inputSupplier.namaSupplier.toUpperCase();
    const suppliers = await Supplier.find({namaSupplier:{$regex: tempSupplier}});
    res.render('suppliers/index', {suppliers});
}

module.exports.newPage = async(req, res) => {
    const supplierCount = await Supplier.find({}).count()+1;
    res.render('suppliers/new', {supplierCount});
}

module.exports.uploadSupplier = async(req, res) => {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.redirect(`/suppliers`);
}

module.exports.showSupplier = async(req, res) => {
    const suppliers = await Supplier.find({});
    const {id} = req.params;
    const supplier = await Supplier.findById(id);
    res.render('suppliers/show', {supplier, suppliers});
}

module.exports.editPage = async(req, res) => {
    const {id} = req.params;
    const supplier = await Supplier.findById(id);
    res.render('suppliers/edit', {supplier});
}

module.exports.editSupplier = async(req, res) => {
    const {id} = req.params;
    const supplier = await Supplier.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/suppliers/${supplier._id}`);
}

module.exports.deleteSupplier = async(req, res) => {
    const {id} = req.params;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    res.redirect('/suppliers');
}