'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema = Schema({
    id_producto: { type: Schema.ObjectId, ref: 'Producto' },
    cantidad_disponible: Number,
    cantidad_productos_vendidos: Number
})

module.exports = mongoose.model('Inventario', InventarioSchema);