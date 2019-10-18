const {Schema, model} = require('mongoose')
const DocumentSchema = new Schema({
  obra: String,
  carpeta: String,   
  asunto: String,
  referencia: String,
  emisor: String,
  firma: String,
  dirigido: String,
  emision: Date,
  recepcion: Date,
  filename: String,
  path: String,
  originalname: String,
  mimetype: String,
  size: Number
})

module.exports = model('Document', DocumentSchema)