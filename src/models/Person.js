const mongoose = require('mongoose');
const {Schema} = mongoose;

const PersonSchema = new Schema({
    dni: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    direccion: { type: String, required: true },
    celular: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Person', PersonSchema)