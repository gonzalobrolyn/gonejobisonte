const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    nombre: String,
    detalle: String,
    imagen: String,
    codigo: String,
    fecha: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', ProductSchema)