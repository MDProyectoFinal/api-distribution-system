'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PedidoSchema = Schema({
    fecha_alta_pedido: Date,
    estado: String,
    cliente: { type: Schema.ObjectId, ref: 'Cliente' },
    producto: { type: Schema.ObjectId, ref: 'Producto' }
})

module.exports = mongoose.model('Pedido', PedidoSchema);