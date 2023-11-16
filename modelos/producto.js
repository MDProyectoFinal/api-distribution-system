'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    descripcion: String,
    imagen: String,
    precio_unitario: Number,
    stock: Number,
    categoria: String
})

module.exports = mongoose.model('Producto', ProductoSchema);