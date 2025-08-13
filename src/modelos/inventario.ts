'use strict'


import mongoose from "mongoose";
import { Schema } from "mongoose";

const inventarioSchema = new mongoose.Schema({
    id_producto: { type: Schema.ObjectId, ref: 'Producto' },
    cantidad_disponible: { type: Number, required: true, default: 0 },
    cantidad_productos_vendidos: { type: Number, required: true, default: 0 }
});

export const InventarioModel = mongoose.model('Inventario', inventarioSchema);