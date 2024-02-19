'use strict'

import mongoose from "mongoose";

const tarjetaDeCreditoSchema = new mongoose.Schema({
    numero_tarjeta: {
        type: String,
        required: true
    },
    nombre_titular: {
        type: String,
        required: true
    },
    fecha_vencimiento: {
        type: Date,
        required: true
    },
    cvv: {
        type: Number,
        required: true
    }
});

export const TarjetaDeCreditoModel = mongoose.model('TarjetaDeCredito', tarjetaDeCreditoSchema);


// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var TarjetaDeCreditoSchema = Schema({
//     numero_tarjeta: String,
//     nombre_titular: String,
//     fecha_vencimiento: Date,
//     cvv: Number
// })

// module.exports = mongoose.model('TarjetaDeCredito', TarjetaDeCreditoSchema);