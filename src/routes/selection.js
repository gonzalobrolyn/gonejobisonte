const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Work = require('../models/Work');
const Folder = require('../models/Folder');
const Document = require('../models/Document');
const { isAuthenticated } = require('../helpers/auth');
const ordenaFecha = require('../helpers/functions');

router.get('/selection', isAuthenticated, async (req, res) => {
    const work = await Work.find({estado: 'Selection'}).sort({fpublicacion: 'desc'});
    work.forEach(work => {
        work.efecha = ordenaFecha(work.fpresentacion)
    });
    res.render('selection/selection', {work});
});

router.get('/selection/work-new', isAuthenticated, (req, res) => {
    res.render('selection/work-new');
});

router.post('/selection/work-new', isAuthenticated, async (req, res) => {
    const {entidad, objeto, tipo, descripcion, seleccion, numero, snip, valor, fpublicacion, fformulacion, fabsolucion, fintegracion, fpresentacion, fotorgamiento } = req.body;
    const errors = [];
    if(!entidad){
        errors.push({text: 'Debe escribir un titulo'});
    }
    if(!descripcion){
        errors.push({text: 'Debe escribir una descripción'});
    }
    if(errors.length > 0){
        res.render('selection/work-new', {
            errors,
            entidad,
            descripcion
        });
    } else {
        const newWork = new Work({entidad, objeto, tipo, descripcion, seleccion, numero, snip, valor, fpublicacion, fformulacion, fabsolucion, fintegracion, fpresentacion, fotorgamiento });
        newWork.estado = 'Selection'
        await newWork.save();
        req.flash('success_msg', 'Obra registrada con exito.')
        res.redirect('/selection');
    }
});

router.put('/selection/work-edit/:id', isAuthenticated, async (req, res) => {
    const {descripcion, entidad, numero, seleccion, valor, fpublicacion, fformulacion, fabsolucion, fintegracion, fpresentacion, fotorgamiento} = req.body
    await Work.findByIdAndUpdate(req.params.id, {descripcion, entidad, numero, seleccion, valor, fpublicacion, fformulacion, fabsolucion, fintegracion, fpresentacion, fotorgamiento})
    req.flash('success_msg', 'Datos actualizados con exito')
    res.redirect('/selection/work/'+req.params.id)
})

router.get('/selection/work/:id', isAuthenticated, async (req, res) => {
    const work = await Work.findById(req.params.id)
    work.epublicacion = ordenaFecha(work.fpublicacion)
    work.eformulacion = ordenaFecha(work.fformulacion)
    work.eabsolucion = ordenaFecha(work.fabsolucion)
    work.eintegracion = ordenaFecha(work.fintegracion)
    work.epresentacion = ordenaFecha(work.fpresentacion)
    work.eotorgamiento = ordenaFecha(work.fotorgamiento)
    const folders = await Folder.find({obra: work.id}).sort({fecha: 'desc'})
    res.render('selection/work', {work, folders});
});

router.get('/selection/work-archivar/:id', async (req, res) => {
    const estado = 'Archived' 
    await Work.findByIdAndUpdate(req.params.id, {estado})
    req.flash('success_msg', 'Obra archivada con exito')
    res.redirect('/selection')
})

router.post('/selection/folder-new/:id', async (req, res) => {
    const obra = req.params.id
    const {nombre} = req.body
    const newFolder = new Folder({nombre, obra})
    await newFolder.save()
    res.redirect('/selection/work/'+obra)
})

router.post('/selection/folder-edit/:id', async (req, res) => {
    const {nombre} = req.body
    await Folder.findByIdAndUpdate(req.params.id, {nombre})
    req.flash('success_msg', 'Nombre de carpeta actualizada')
    res.redirect('/selection/folder/'+req.params.id)
})

router.get('/selection/folder-del/:id/:work', async (req, res) => {
    const id = req.params.id
    await Folder.findByIdAndDelete(id)
    const idWork = req.params.work
    res.redirect('/selection/work/'+idWork)
})

router.get('/selection/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const documents = await Document.find({carpeta: folder.id})
    const folders = await Folder.find({obra: folder.obra}).sort({fecha: 'desc'})
    res.render('selection/folder', {folder, documents, folders})
})

router.post('/selection/doc-new/:folder/:work', async (req, res) => {
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
    res.redirect('/selection/folder/'+carpeta)
})

router.get('/selection/doc-del/:id', async (req, res) => {
    const id = req.params.id
    const document = await Document.findByIdAndDelete(id)
    await fs.unlink(path.resolve('./src/public/'+document.path))
    res.redirect('/selection/folder/'+document.carpeta)
})

module.exports = router;