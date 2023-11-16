'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonaSchema = Schema({
    nombre: String,
    apellido: String,
    fecha_nacimiento: String,
    direccion: String,
    telefono: String
})

module.exports = mongoose.model('Persona', PersonaSchema);
