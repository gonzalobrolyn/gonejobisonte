const mongoose = require('mongoose')
const {Schema} = mongoose

const StorageSchema = new Schema({
  obra: {type: Schema.ObjectId, ref:'Work'},
  encargado: {type: Schema.ObjectId, ref:'Employe'},
  direccion: String
})

module.exports = mongoose.model('Storage', StorageSchema)