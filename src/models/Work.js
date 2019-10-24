const mongoose = require('mongoose');
const {Schema} = mongoose;

const WorkSchema = new Schema({
    estado: String,
    entidad: String,
    objeto: String,
    tipo: String,
    descripcion: String,
    seleccion: String,
    numero: String,
    snip: String ,
    valor: String,
    fpublicacion: Date,
    fformulacion: Date,
    fabsolucion: Date,
    fintegracion: Date,
    fpresentacion: Date,
    fotorgamiento: Date,
    ffirmacontrato: Date,
    finicioobra: Date,
    ejecutor: String
});

module.exports = mongoose.model('Work', WorkSchema)