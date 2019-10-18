const mongoose = require('mongoose');
const {Schema} = mongoose;

const CompanySchema = new Schema({
    razon: { type: String, required: true },
    ruc: { type: String, required: true },
    direccion: { type: String, required: true },
    date: { type: Date, default: Date.now },
    gerente: { type: String}
});

module.exports = mongoose.model('Company', CompanySchema)