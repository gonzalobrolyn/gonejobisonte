const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Company = require('../models/Company');
const Folder = require('../models/Folder')
const Document = require('../models/Document')
const { isAuthenticated } = require('../helpers/auth');

router.get('/manage/origin', isAuthenticated, (req, res) => {
    res.render('manage/new-company');
});

router.post('/manage/new-company', isAuthenticated, async (req, res) => {
    const { razon, ruc, direccion } = req.body;
    const errors = [];
    if(!razon){
        errors.push({text: 'Debe escribir una razon social'});
    }
    if(!ruc){
        errors.push({text: 'Debe escribir un número de RUC'});
    }
    if(!direccion){
        errors.push({text: 'Debe escribir una dirección'});
    }
    if(errors.length > 0){
        res.render('manage/new-company', {
            errors,
            razon,
            ruc,
            direccion
        });
    } else {
        const newCompany = new Company({ razon, ruc, direccion});
        newCompany.gerente = req.user.id;
        await newCompany.save();
        req.flash('success_msg', 'Empresa agregada con exito.')
        res.redirect('/manage');
    }
});

router.get('/manage', isAuthenticated, async (req, res) => {
    const company = await Company.findOne();
    if (company){
        const folders = await Folder.find({empresa: company.id}).sort({fecha: 'desc'})
        res.render('manage/company', {company, folders});
    } else {
        res.render('manage/company');
    }
});

router.get('/manage/edit/:id', isAuthenticated, async (req, res) => {
    const company = await Company.findById(req.params.id);
    res.render('manage/edit-company', {company});
});

router.put('/manage/edit-company/:id', isAuthenticated, async (req, res) => {
    const {razon, ruc, direccion} = req.body;
    await Company.findByIdAndUpdate(req.params.id, {razon, ruc, direccion});
    req.flash('success_msg', 'Información actualizada con exito.')
    res.redirect('/manage');
});

router.post('/manage/folder-new/:id', isAuthenticated, async (req, res) => {
    const empresa = req.params.id
    const {nombre} = req.body
    const newFolder = new Folder({nombre, empresa})
    await newFolder.save()
    res.redirect('/manage')
})

router.post('/manage/folder-edit/:id', async (req, res) => {
    const {nombre} = req.body
    await Folder.findByIdAndUpdate(req.params.id, {nombre})
    req.flash('success_msg', 'Nombre de carpeta actualizada')
    res.redirect('/manage/folder/'+req.params.id)
})

router.get('/manage/folder-del/:id', async (req, res) => {
    const id = req.params.id
    await Folder.findByIdAndDelete(id)
    res.redirect('/manage')
})

router.get('/manage/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const documents = await Document.find({carpeta: folder.id})
    const folders = await Folder.find({empresa: folder.empresa}).sort({fecha: 'desc'})
    res.render('manage/folder', {folder, documents, folders})
})

router.post('/manage/doc-new/:folder', async (req, res) => {
    const carpeta = req.params.folder
    const {asunto, referencia} = req.body
    const {filename, originalname, mimetype, size} = req.file
    const newDocument = new Document({
        carpeta, asunto, referencia, 
        filename, path: '/uploads/' + filename,
        originalname, mimetype, size
    })
    await newDocument.save()
    res.redirect('/manage/folder/'+carpeta)
})

router.get('/manage/doc-del/:id', async (req, res) => {
    const id = req.params.id
    const document = await Document.findByIdAndDelete(id)
    await fs.unlink(path.resolve('./src/public/'+document.path))
    res.redirect('/manage/folder/'+document.carpeta)
})

module.exports = router;