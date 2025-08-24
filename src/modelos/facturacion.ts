'use strict'

import mongoose from "mongoose";
import { Schema } from "mongoose";

const facturacionSchema = new mongoose.Schema({
    id_compra: { type: Schema.ObjectId, ref: 'Compra' },
    fecha_hora_factura: { type: Date, required: true },
    nombre_comprador: { type: String, required: true },
    telefono_comprador: { type: String, required: true },
    direccion_comprador: { type: String, required: true },
    total_a_pagar: { type: Number, required: true }
});

export const FacturacionModel = mongoose.model('Facturacion', facturacionSchema);