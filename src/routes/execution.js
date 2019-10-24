const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Work = require('../models/Work');
const Folder = require('../models/Folder');
const Document = require('../models/Document');
const { isAuthenticated } = require('../helpers/auth')
const ordenaFecha = require('../helpers/functions')


router.get('/execution', isAuthenticated, async(req, res) => {
    const work = await Work.find({estado: 'Execution'}).sort({fpublicacion: 'desc'})
    work.forEach(work => {
        work.efecha = ordenaFecha(work.fpresentacion)
    })
    res.render('execution/execution', {work});
});

router.put('/execution/work-edit/:id', isAuthenticated, async (req, res) => {
    const {descripcion, entidad, numero, seleccion, valor, finicioobra, ejecutor} = req.body
    await Work.findByIdAndUpdate(req.params.id, {descripcion, entidad, numero, seleccion, valor, finicioobra, ejecutor})
    req.flash('success_msg', 'Datos actualizados con exito')
    res.redirect('/execution/work/'+req.params.id)
})

router.get('/execution/work/:id', isAuthenticated, async (req, res) => {
    const work = await Work.findById(req.params.id)
    if(work.finicioobra){
        work.einicioobra = ordenaFecha(work.finicioobra)
    }
    const folders = await Folder.find({obra: work.id}).sort({fecha: 'desc'})
    res.render('execution/work', {work, folders});
});

router.post('/execution/folder-new/:id', async (req, res) => {
    const obra = req.params.id
    const {nombre} = req.body
    const newFolder = new Folder({nombre, obra})
    await newFolder.save()
    res.redirect('/execution/work/'+obra)
})


router.post('/execution/folder-edit/:id', async (req, res) => {
    const {nombre} = req.body
    await Folder.findByIdAndUpdate(req.params.id, {nombre})
    req.flash('success_msg', 'Nombre de carpeta actualizada')
    res.redirect('/execution/folder/'+req.params.id)
})

router.get('/execution/folder-del/:id/:work', async (req, res) => {
    const id = req.params.id
    await Folder.findByIdAndDelete(id)
    const idWork = req.params.work
    res.redirect('/execution/work/'+idWork)
})

router.get('/execution/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const documents = await Document.find({carpeta: folder.id})
    const folders = await Folder.find({obra: folder.obra}).sort({fecha: 'desc'})
    res.render('execution/folder', {folder, documents, folders})
})

router.post('/execution/doc-new/:folder/:work', async (req, res) => {
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
    res.redirect('/execution/folder/'+carpeta)
})

router.get('/execution/doc-del/:id', async (req, res) => {
    const id = req.params.id
    const document = await Document.findByIdAndDelete(id)
    await fs.unlink(path.resolve('./src/public/'+document.path))
    res.redirect('/execution/folder/'+document.carpeta)
})

router.get('/execution/liquidate/:id', async (req, res) => {
    const estado = 'Liquidate'
    await Work.findByIdAndUpdate(req.params.id, {estado})
    req.flash('success_msg', 'Obra en etapa de liquidación')
    res.redirect('/liquidate')
})

module.exports = router;