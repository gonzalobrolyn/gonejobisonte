const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Work = require('../models/Work');
const Folder = require('../models/Folder');
const Document = require('../models/Document');
const { isAuthenticated } = require('../helpers/auth')
const ordenaFecha = require('../helpers/functions')


router.get('/liquidate', isAuthenticated, async(req, res) => {
    const work = await Work.find({estado: 'Liquidate'}).sort({fpublicacion: 'desc'})
    work.forEach(work => {
        work.efecha = ordenaFecha(work.fpresentacion)
    })
    res.render('liquidate/liquidate', {work});
});

router.get('/liquidate/work/:id', isAuthenticated, async (req, res) => {
    const work = await Work.findById(req.params.id)
    if(work.finicioobra){
        work.einicioobra = ordenaFecha(work.finicioobra)
    }
    const folders = await Folder.find({obra: work.id}).sort({fecha: 'desc'})
    res.render('liquidate/work', {work, folders});
});

module.exports = router;