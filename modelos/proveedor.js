'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProveedorSchema = Schema({    
    apellido_nombre: String,
    cuil: String,
    dni: String,
    telefono: String,
    direccion: String,
    email: String    
})

module.exports = mongoose.model('Proveedor', ProveedorSchema);
