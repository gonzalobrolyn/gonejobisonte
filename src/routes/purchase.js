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

router.get('/purchase', isAuthenticated, (req, res) => {
    res.render('purchase/purchase');
});

module.exports = router;