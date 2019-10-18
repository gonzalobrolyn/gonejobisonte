const mongoose = require('mongoose');
const {Schema} = mongoose;
//const Person = require('./Person');

const EmployeSchema = new Schema({
    persona: { type: Schema.ObjectId, ref: 'Person'},
    ruc: { type: String, required: true },
    foto: { type: String },
    email: { type: String },
    cumple: { type: Date },
    contacto: { type: String },
    profesion: { type: String, required: true },
    area: { type: String, required: true },
    cargo: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employe', EmployeSchema);
