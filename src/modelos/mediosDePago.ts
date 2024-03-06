'use strict'


import mongoose from "mongoose";

const mediosDePagoSchema = new mongoose.Schema({
    numero_tarjeta: { type: String, required: true },
    estado_medio_de_pago: { type: String, required: true, default: 'Activo' }
});

export const MediosDePagoModel = mongoose.model('MediosDePago', mediosDePagoSchema);



// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var MediosDePagoSchema = Schema({
//     numero_tarjeta: String,
//     estado_medio_de_pago: String
// })

// module.exports = mongoose.model('MediosDePago', MediosDePagoSchema);