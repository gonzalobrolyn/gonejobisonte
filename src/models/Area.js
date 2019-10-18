const mongoose = require('mongoose');
const {Schema} = mongoose;

const AreaSchema = new Schema({
    nombre: { type: String, required: true }
});

module.exports = mongoose.model('Area', AreaSchema)