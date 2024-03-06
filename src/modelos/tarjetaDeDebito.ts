'use strict'


import mongoose from "mongoose";

const tarjetaDeDebitoSchema = new mongoose.Schema({
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

export const TarjetaDeDebitoModel = mongoose.model('TarjetaDeDebito', tarjetaDeDebitoSchema);



// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var TarjetaDeDebitoSchema = Schema({
//     numero_tarjeta: String,
//     nombre_titular: String,
//     fecha_vencimiento: Date,
//     cvv: Number
// })

// module.exports = mongoose.model('TarjetaDeDebito', TarjetaDeDebitoSchema);