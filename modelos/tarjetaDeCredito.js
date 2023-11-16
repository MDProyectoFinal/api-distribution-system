'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TarjetaDeCreditoSchema = Schema({
    numero_tarjeta: String,
    nombre_titular: String,
    fecha_vencimiento: Date,
    cvv: Number
})

module.exports = mongoose.model('TarjetaDeCredito', TarjetaDeCreditoSchema);