'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VendedorSchema = Schema({
    apellido_nombre: String,
    zona_cubierta: String // Zona que cubre del pais, pueblo o región en la venta
})

module.exports = mongoose.model('Vendedor', VendedorSchema);