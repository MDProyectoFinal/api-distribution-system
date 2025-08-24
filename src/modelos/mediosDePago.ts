'use strict'


import mongoose from "mongoose";

const mediosDePagoSchema = new mongoose.Schema({
    numero_tarjeta: { type: String, required: true },
    estado_medio_de_pago: { type: String, required: true, default: 'Activo' }
});

export const MediosDePagoModel = mongoose.model('MediosDePago', mediosDePagoSchema);