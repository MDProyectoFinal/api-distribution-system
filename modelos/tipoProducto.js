'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TipoProductoSchema = Schema({
    descripcion: String
})

module.exports = mongoose.model('TipoProducto', TipoProductoSchema);