const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Work = require('../models/Work');
const Folder = require('../models/Folder');
const Document = require('../models/Document');
const { isAuthenticated } = require('../helpers/auth')
const ordenaFecha = require('../helpers/functions')

router.get('/library', isAuthenticated, async (req, res) => {
    const work = await Work.find({estado: 'Archive'}).sort({fpublicacion: 'desc'})
    work.forEach(work => {
        work.efecha = ordenaFecha(work.fpresentacion)
    })
    res.render('library/library', {work});
});

router.get('/library/work/:id', isAuthenticated, async (req, res) => {
    const work = await Work.findById(req.params.id)
    if(work.finicioobra){
        work.einicioobra = ordenaFecha(work.finicioobra)
    }
    const folders = await Folder.find({obra: work.id}).sort({fecha: 'desc'})
    res.render('library/work', {work, folders});
});

router.get('/library/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const documents = await Document.find({carpeta: folder.id})
    const folders = await Folder.find({obra: folder.obra}).sort({fecha: 'desc'})
    res.render('library/folder', {folder, documents, folders})
})

module.exports = router;