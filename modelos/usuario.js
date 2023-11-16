'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    persona: String, // { type: Schema.ObjectId, ref: 'Persona' },
    nombre_usuario: String,    
    clave: String,  
    email: String,
    rol: String, // Sería el Tipo de Usuario
    imagen: String,
    fecha_registro: Date,
    fecha_ultimo_inicio_sesion: Date       
})

module.exports = mongoose.model('Usuario', UsuarioSchema);

