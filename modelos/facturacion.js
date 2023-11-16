'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturacionSchema = Schema({
    id_compra: { type: Schema.ObjectId, ref: 'Compra' },
    fecha_hora_factura: Date,
    nombre_comprador: String,
    telefono_comprador: String,
    direccion_comprador: String,
    total_a_pagar: Number
})

module.exports = mongoose.model('Facturacion', FacturacionSchema);