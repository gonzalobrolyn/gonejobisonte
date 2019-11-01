const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    nombre: {type: String, index: true},
    detalle: {type: String, index: true},
    imagen: String,
    codigo: {type: String, index: true},
    fecha: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', ProductSchema)