const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Person = require('../models/Person');
const Employe = require('../models/Employe');
const Folder = require('../models/Folder')
const Document = require('../models/Document')
const { isAuthenticated } = require('../helpers/auth');
const ordenaFecha = require('../helpers/functions');

router.get('/employe/person-add', isAuthenticated, (req, res) => {
    res.render('employe/person-new');
});

router.post('/employe/person-new', isAuthenticated, async (req, res) => {
    const { dni, nombre, apellido, direccion, celular} = req.body;
    const errors = [];
    if(!dni){
        errors.push({text: 'Debe escribir un número de DNI '});
    }
    if(!nombre){
        errors.push({text: 'Debe escribir almenos un nombre'});
    }
    if(!apellido){
        errors.push({text: 'Debe escribir almenos un apellido'});
    }
    if(!direccion){
        errors.push({text: 'Debe escribir una dirección'});
    }
    if(!celular){
        errors.push({text: 'Debe escribir un número de celular'});
    }
    if(errors.length > 0){
        res.render('employe/person-new', {
            errors,
            dni,
            nombre,
            apellido,
            direccion,
            celular
        });
    } else {
        const dniPerson = await Person.findOne({dni: dni});
        if(dniPerson){
            req.flash('error_msg', 'El número de DNI ya esta registrado');
            res.redirect('/employe/person-add');
        } else {
            const newPerson = new Person({ dni, nombre, apellido, direccion, celular});
            await newPerson.save();
            req.flash('success_msg', 'Datos agregados con exito.')
            res.redirect('/employe/person');
        }
    }
});

router.get('/employe/person', isAuthenticated, async (req, res) => {
    const person = await Person.find().sort({apellido: 'asc'});
    res.render('employe/person', {person});
});

router.get('/employe/person-edit/:id', isAuthenticated, async (req, res) => {
    const person = await Person.findById(req.params.id);
    res.render('employe/person-edit', {person});
});

router.put('/employe/person-edit/:id', isAuthenticated, async (req, res) => {
    const {dni, nombre, apellido, direccion, celular} = req.body;
    const dniPerson = await Person.findOne({dni: dni});
    if(dniPerson && dniPerson._id != req.params.id){
        req.flash('error_msg', 'No se guardaron los cambios, el número de DNI ya esta registrado.');
        res.redirect('/employe/person');
    } else {
        await Person.findByIdAndUpdate(req.params.id, {dni, nombre, apellido, direccion, celular});
        req.flash('success_msg', 'Datos actualizados con exito.')
        res.redirect('/employe/person');
    }
});

router.delete('/employe/person-delete/:id', isAuthenticated, async (req, res) => {
    await Person.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Datos eliminados con exito.')
    res.redirect('/employe/person');
});

router.get('/employe/employe-add/:id', isAuthenticated, async (req, res) => {
    const person = await Person.findById(req.params.id);
    res.render('employe/employe-new', {person});
});

router.post('/employe/employe-new/:id', isAuthenticated, async (req, res) => {
    const {persona, ruc, email, cumple, profesion, area, cargo} = req.body;
    const errors = [];
    if(!ruc){
        errors.push({text: 'Debe escribir un número de RUC'});
    }
    if(!email){
        errors.push({text: 'Debe escribir un correo electronico'});
    }
    if(!cumple){
        errors.push({text: 'Debe escribir una fecha de nacimiento'});
    }
    if(!profesion){
        errors.push({text: 'Debe escribir una profesión'});
    }
    if(!area){
        errors.push({text: 'Debe escribir un area'});
    }
    if(!cargo){
        errors.push({text: 'Debe escribir un cargo'});
    }
    if(errors.length > 0){
        const person = await Person.findById(req.params.id);
        res.render('employe/employe-new', {
            errors, person, ruc, email, cumple, profesion, area, cargo
        });
    } else {
        const rucEmploye = await Employe.findOne({ruc: ruc})
        if(rucEmploye){
            const person = await Person.findById(req.params.id);
            errors.push({text: 'El número de RUC ya esta registrado.'})
            res.render('employe/employe-new', {
                errors, person, email, cumple, profesion, area, cargo
            });
        } else {
            const newEmploye = new Employe({persona, ruc, email, cumple, profesion, area, cargo});
            newEmploye.persona = req.params.id;
            await newEmploye.save();
            req.flash('success_msg', 'Empleado agregado con exito.');
            res.redirect('/employe');
        }
    }
});

router.get('/employe', isAuthenticated, async (req, res) => {
    const employe = await Employe.find().populate('persona');

    res.render('employe/employe', {employe});
});

router.get('/employe/employe-view/:id', isAuthenticated, async (req, res) => {
    const employe = await Employe.findById(req.params.id).populate('persona')
    const folders = await Folder.find({empleado: employe.id}).sort({fecha: 'desc'})
    res.render('employe/employe-view', {employe, folders})
})

router.get('/employe/employe-edit/:id', isAuthenticated, async (req, res) => {
    const employe = await Employe.findById(req.params.id)
    employe.ecumple = ordenaFecha(employe.cumple)
    res.render('employe/employe-edit', {employe})
});

router.put('/employe/employe-edit/:id', isAuthenticated, async (req, res) => {
    const {ruc, email, cumple, profesion, area, cargo} = req.body;
    const rucEmploye = await Employe.findOne({ruc: ruc});
    if(rucEmploye && rucEmploye._id != req.params.id){
        req.flash('error_msg', `No se guardaron los cambios, el número de RUC ya esta registrado.`);
        res.redirect('/employe');
    } else {
        await Employe.findByIdAndUpdate(req.params.id, {ruc, email, cumple, profesion, area, cargo});
        req.flash('success_msg', 'Datos actualizados con exito.')
        res.redirect('/employe');
    }
});

router.delete('/employe/employe-delete/:id', isAuthenticated, async (req, res) => {
    await Employe.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Datos eliminados con exito.')
    res.redirect('/employe');
});

router.post('/employe/folder-new/:id', isAuthenticated, async (req, res) => {
    const empleado = req.params.id
    const {nombre} = req.body
    const newFolder = new Folder({nombre, empleado})
    await newFolder.save()
    res.redirect('/employe/employe-view/'+empleado)
})

router.post('/employe/folder-edit/:id', async (req, res) => {
    const {nombre} = req.body
    await Folder.findByIdAndUpdate(req.params.id, {nombre})
    req.flash('success_msg', 'Nombre de carpeta actualizada')
    res.redirect('/employe/folder/'+req.params.id)
})

router.get('/employe/folder-del/:id/:employe', async (req, res) => {
    const id = req.params.id
    await Folder.findByIdAndDelete(id)
    const idEmploye = req.params.employe
    res.redirect('/employe/employe-view/'+idEmploye)
})

router.get('/employe/folder/:id', isAuthenticated, async (req, res) => {
    const folder = await Folder.findById(req.params.id) 
    const documents = await Document.find({carpeta: folder.id})
    const folders = await Folder.find({empleado: folder.empleado}).sort({fecha: 'desc'})
    res.render('employe/folder', {folder, documents, folders})
})

router.post('/employe/doc-new/:folder', async (req, res) => {
    const carpeta = req.params.folder
    const {asunto, referencia} = req.body
    const {filename, originalname, mimetype, size} = req.file
    const newDocument = new Document({
        carpeta, asunto, referencia, 
        filename, path: '/uploads/' + filename,
        originalname, mimetype, size
    })
    await newDocument.save()
    res.redirect('/employe/folder/'+carpeta)
})

router.get('/employe/doc-del/:id', async (req, res) => {
    const id = req.params.id
    const document = await Document.findByIdAndDelete(id)
    await fs.unlink(path.resolve('./src/public/'+document.path))
    res.redirect('/employe/folder/'+document.carpeta)
})

module.exports = router;