'use strict'

import mongoose from "mongoose";

const promocionSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    fecha_desde: { type: Date, required: true },
    fecha_hasta: { type: Date, required: true },
    estado: { type: String, required: true, default: 'Inactiva' } // Podria ser un bit y tener una clase "tipo_promocion"
});

export const PromocionModel = mongoose.model('Promocion', promocionSchema);



// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var PromocionSchema = Schema({
//     descripcion: String,
//     fecha_desde: Date,
//     fecha_hasta: Date,
//     estado: String // Podria ser un bit y tener una clase "tipo_promocion"
// })

// module.exports = mongoose.model('Promocion', PromocionSchema);