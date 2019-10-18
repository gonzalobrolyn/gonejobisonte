const mongoose = require('mongoose');
const {Schema} = mongoose;

const FolderSchema = new Schema({
    nombre: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    obra: String,
    empleado: String,
    empresa: String,
    area: String,
    grupo: String
});

module.exports = mongoose.model('Folder', FolderSchema)