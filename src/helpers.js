// esquema de los documentos
const mongoose = require('mongoose');
const {Schema} = mongoose;

const ..Schema = new Schema({
    : { type: String, required: true },
    : { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String}
});

module.exports = mongoose.model('..', ..Schema)

// rutas de los modulos
const express = require('express');
const router = express.Router();

router.get('/ruta', (req, res) => {
    res.render('ruta/modulo');
});

module.exports = router;