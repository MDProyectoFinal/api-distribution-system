'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdministradorSchema = Schema({
    nombre_usuario: String,
    clave: String 
})

module.exports = mongoose.model('Administrador', AdministradorSchema);