const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAuthenticated } = require('../helpers/auth');

router.get('/purchase/product', isAuthenticated, async (req, res) => {
    const product = await Product.find().sort({nombre: 'asc'})
    res.render('purchase/product', {product});
})

router.get('/purchase/product-new', isAuthenticated, async (req, res) => {
    res.render('purchase/product-new');
})

router.post('/purchase/product-new', isAuthenticated, async(req, res) => {
    const {codigo, nombre, detalle} = req.body
    const newProduct = new Product({codigo, nombre, detalle})
    await newProduct.save()
    req.flash('success_msg', 'Producto registrado con exito')
    res.redirect('/purchase/product')
})

router.post('/purchase/product-edit/:id', isAuthenticated, async(req, res) => {
    const {codigo, nombre, detalle} = req.body
    await Product.findByIdAndUpdate(req.params.id, {codigo, nombre, detalle})
    req.flash('success_msg', 'Producto actualizado con exito')
    res.redirect('/purchase/product')
})

router.get('/purchase/product-del/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id
    await Product.findByIdAndDelete(id)
    res.redirect('/purchase/product')
})

router.get('/purchase', isAuthenticated, async(req, res) => {
    const products = await Product.find().sort({nombre: 'asc'})
    res.render('purchase/purchase', products);
});

router.get('/purchase/search', isAuthenticated, async (req, res) => {
    
    if(req.query.q){
       const products = await Product.find(
            {$text: {$search: req.query.q}},
            {score: {$meta: 'textScore'}}
        ).sort({score: {$meta: 'textScore'}})
        console.log(products)
    }
    res.render('purchase/purchase')
})

module.exports = router;