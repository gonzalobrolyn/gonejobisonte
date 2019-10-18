const express = require('express');
const router = express.Router();
const Employe = require('../models/Employe');
const Person = require('../models/Person');
const User = require('../models/User');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/sign/:user', async (req, res) => {
    const name = req.params.user
    const password = 'gon'+name.length+'ejo'
    const admin = new User({name, password})
    admin.password = await admin.encryptPassword(password)
    await admin.save()
    res.render('users/signin')
})

router.get('/users', isAuthenticated, async (req, res) => {
    const users = await User.find().sort({date: 'desc'});
    res.render('users/all-users', { users });
});

router.get('/users/signup/:id', isAuthenticated, async (req, res) => {
    const employe = await Employe.findById(req.params.id);
    const person = await Person.findById(employe.persona)
    res.render('users/signup', {employe, person});
});

router.post('/users/signup/:id', isAuthenticated, async (req, res) => {
    const {role, name, password, confirm_password} = req.body;
    const errors = [];
    if(role === 'A'){
        errors.push({text: 'Seleccione un rol para el usuario.'})
    }
    if(name.length <= 0){
        errors.push({text: 'Escriba un usuario'})
    }
    if(password != confirm_password){
        errors.push({text: 'La contraseña no coincide.'});
    }
    if(password.length < 4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres.'});
    }
    if(errors.length > 0){
        const employe = await Employe.findById(req.params.id)
        const person = await Person.findById(employe.persona)
        res.render('users/signup', {errors, role, name, employe, person});
    } else {
        const nameUser = await User.findOne({name: name});
        const employe = await Employe.findById(req.params.id)
        const person = await Person.findById(employe.persona)
        if(nameUser){
            errors.push({text: 'El usuario ya esta registrado.'});
            res.render('users/signup', {errors, employe, person, role, name});
        } else {
            const newUser = new User({role, name, password})
            newUser.password = await newUser.encryptPassword(password)
            newUser.employe = req.params.id
            newUser.person = employe.persona
            await newUser.save();
            req.flash('success_msg', 'Se ha registrado con exito.');
            res.redirect('/users');    
        }
    }
});

router.get('/users/edit/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/edit-user', {user});
});

router.put('/users/edit-user/:id', isAuthenticated, async (req, res) => {
    const { name} = req.body;
    await User.findByIdAndUpdate(req.params.id, { name});
    req.flash('success_msg', 'Usuario actualizado con exito.')
    res.redirect('/users');
});

router.delete('/users/delete/:id', isAuthenticated, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Usuario eliminado con exito.')
    res.redirect('/users');
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;