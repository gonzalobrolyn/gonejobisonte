const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Folder = require('../models/Folder')
const Document = require('../models/Document')
const { isAuthenticated } = require('../helpers/auth');

router.get('/accounting', isAuthenticated, async(req, res) => {
    const groups = await Folder.find({area: 'Contabilidad'})
    res.render('accounting/case', {groups})
});

router.get('/accounting/group/:id', isAuthenticated, async (req, res) => {
    const groups = await Folder.find({area: 'Contabilidad'})
    const folders = await Folder.find({grupo: req.params.id}).sort({fecha: 'desc'})
    res.render('accounting/case', {groups, folders}
    )
})

router.post('/accounting/group-new', isAuthenticated, async (req, res) => {
    const area = 'Contabilidad'
    const {nombre} = req.body
    const newFolder = new Folder({nombre, area})
    await newFolder.save()
    res.redirect('/accounting')
})

router.post('/accounting/folder-new/:id', isAuthenticated, async (req, res) => {
    const grupo = req.params.id
    const {nombre} = req.body
    const newFolder = new Folder({nombre, grupo})
    await newFolder.save()
    res.redirect('/accounting/group/'+grupo)
})

router.post('/accounting/folder-edit/:id', async (req, res) => {
    const {nombre} = req.body
    await Folder.findByIdAndUpdate(req.params.id, {nombre})
    req.flash('success_msg', 'Nombre de carpeta actualizada')
    res.redirect('/accounting/folder/'+req.params.id)
})

router.get('/accounting/folder-del/:id/:group', async (req, res) => {
    const id = req.params.id
    await Folder.findByIdAndDelete(id)
    res.redirect('/accounting/group/'+req.params.group)
})

router.get('/accounting/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const groups = await Folder.find({area: 'Contabilidad'})
    const folders = await Folder.find({grupo: folder.grupo}).sort({fecha: 'desc'})
    const documents = await Document.find({carpeta: folder.id})
    res.render('accounting/folder', {folder, groups, documents, folders})
})

router.post('/accounting/doc-new/:folder', async (req, res) => {
    const carpeta = req.params.folder
    const {asunto, referencia} = req.body
    const {filename, originalname, mimetype, size} = req.file
    const newDocument = new Document({
        carpeta, asunto, referencia, 
        filename, path: '/uploads/' + filename,
        originalname, mimetype, size
    })
    await newDocument.save()
    res.redirect('/accounting/folder/'+carpeta)
})

router.get('/accounting/doc-del/:id', async (req, res) => {
    const id = req.params.id
    const document = await Document.findByIdAndDelete(id)
    await fs.unlink(path.resolve('./src/public/'+document.path))
    res.redirect('/accounting/folder/'+document.carpeta)
})

module.exports = router;