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

router.put('/liquidate/work-edit/:id', isAuthenticated, async (req, res) => {
    const {descripcion, entidad, numero, seleccion, valor, finicioobra, ejecutor} = req.body
    await Work.findByIdAndUpdate(req.params.id, {descripcion, entidad, numero, seleccion, valor, finicioobra, ejecutor})
    req.flash('success_msg', 'Datos actualizados con exito')
    res.redirect('/liquidate/work/'+req.params.id)
})

router.get('/liquidate/work/:id', isAuthenticated, async (req, res) => {
    const work = await Work.findById(req.params.id)
    if(work.finicioobra){
        work.einicioobra = ordenaFecha(work.finicioobra)
    }
    const folders = await Folder.find({obra: work.id}).sort({fecha: 'desc'})
    res.render('liquidate/work', {work, folders});
});

router.post('/liquidate/folder-new/:id', async (req, res) => {
    const obra = req.params.id
    const {nombre} = req.body
    const newFolder = new Folder({nombre, obra})
    await newFolder.save()
    res.redirect('/liquidate/work/'+obra)
})

router.post('/liquidate/folder-edit/:id', async (req, res) => {
    const {nombre} = req.body
    await Folder.findByIdAndUpdate(req.params.id, {nombre})
    req.flash('success_msg', 'Nombre de carpeta actualizada')
    res.redirect('/liquidate/folder/'+req.params.id)
})

router.get('/liquidate/folder-del/:id/:work', async (req, res) => {
    const id = req.params.id
    await Folder.findByIdAndDelete(id)
    const idWork = req.params.work
    res.redirect('/liquidate/work/'+idWork)
})

router.get('/liquidate/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const documents = await Document.find({carpeta: folder.id})
    const folders = await Folder.find({obra: folder.obra}).sort({fecha: 'desc'})
    res.render('liquidate/folder', {folder, documents, folders})
})

router.post('/liquidate/doc-new/:folder/:work', async (req, res) => {
    const obra = req.params.work
    const carpeta = req.params.folder
    const {asunto, referencia, emisor} = req.body
    const {filename, originalname, mimetype, size} = req.file
    const newDocument = new Document({
        obra, carpeta, asunto, referencia, emisor, 
        filename, path: '/uploads/' + filename,
        originalname, mimetype, size
    })
    await newDocument.save()
    res.redirect('/liquidate/folder/'+carpeta)
})

router.get('/liquidate/doc-del/:id', async (req, res) => {
    const id = req.params.id
    const document = await Document.findByIdAndDelete(id)
    await fs.unlink(path.resolve('./src/public/'+document.path))
    res.redirect('/liquidate/folder/'+document.carpeta)
})

router.get('/liquidate/archive/:id', async (req, res) => {
    const estado = 'Archive'
    await Work.findByIdAndUpdate(req.params.id, {estado})
    req.flash('success_msg', 'Obra archivada en biblioteca')
    res.redirect('/liquidate')
})

module.exports = router;