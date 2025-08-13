'use strict'

import mongoose from "mongoose";
import { Schema } from "mongoose";

const compraSchema = new mongoose.Schema({
    id_usuario: { type: Schema.ObjectId, ref: 'Usuario', required: true },
    id_producto: { type: Schema.ObjectId, ref: 'Producto', required: true },
    precio_total: { type: Number, required: true },
    fecha_hora_compra: { type: Date, required: true },
    id_medio_pago: { type: Schema.ObjectId, ref: 'mediosDePago' },
});

export const CompraModel = mongoose.model('Compra', compraSchema);