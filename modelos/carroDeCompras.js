'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarroDeComprasSchema = Schema({
    id_usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    id_producto: { type: Schema.ObjectId, ref: 'Producto' },
    cantidad_productos: Number
})

module.exports = mongoose.model('CarroDeCompras', CarroDeComprasSchema);