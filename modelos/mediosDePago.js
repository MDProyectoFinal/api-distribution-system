'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediosDePagoSchema = Schema({
    numero_tarjeta: String,
    estado_medio_de_pago: String
})

module.exports = mongoose.model('MediosDePago', MediosDePagoSchema);