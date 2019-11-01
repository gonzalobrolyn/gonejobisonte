const mongoose = require('mongoose');
const {Schema} = mongoose;

const PurchaseSchema = new Schema({
    proveedor: String,
    ruc: String,
    numero: String,
    productos: [{type: Schema.ObjectId, ref: 'Product'}, {
      cantidad: Number,
      precio: Number
    }],
    fecha: Date
});

module.exports = mongoose.model('Purchase', PurchaseSchema)