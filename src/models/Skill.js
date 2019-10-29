// esquema de habilidades
const mongoose = require('mongoose');
const {Schema} = mongoose;

const SkillSchema = new Schema({
    persona: { type: String, required: true },
    empresa: { type: String, required: true },
    area: { type: String },
    cargo: { type: String },
    inicio: { type: Date },
    final: { type: Date },
    archivo: { type: String }
});

module.exports = mongoose.model('Skill', SkillSchema)