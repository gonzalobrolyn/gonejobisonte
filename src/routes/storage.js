const express = require('express')
const router = express.Router()
const Storage = require('../models/Storage')
const Work = require('../models/Work')
const Employe = require('../models/Employe')
const {isAuthenticated} = require('../helpers/auth')

router.get('/storage/storage-new', isAuthenticated, async(req, res) => {
    const works = await Work.find().sort({date: 'desc'})
    const employes = await Employe.find().populate('persona')
    res.render('storage/storage-new', {works, employes})
})

router.post('/storage/storage-new', isAuthenticated, async(req, res) => {
    const {direccion, obra, encargado} = req.body
    const newStorage = new Storage({direccion, obra, encargado})
    await newStorage.save()
    req.flash('success_msg', 'Almacen agregado con exito')
    res.redirect('/storage')
})

router.get('/storage', isAuthenticated, async(req, res) => {
    const storage = await Storage.find().populate('obra').populate({path:'encargado', populate: {path: 'persona'}})
    res.render('storage/storage', {storage})
})

module.exports = router