'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompraSchema = Schema({
    id_usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    id_producto: { type: Schema.ObjectId, ref: 'Producto' },
    precio_total: Number,
    fecha_hora_compra: Date,
    id_medio_pago: { type: Schema.ObjectId, ref: 'mediosDePago' },
})

module.exports = mongoose.model('Compra', CompraSchema);