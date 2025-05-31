'use strict'

import mongoose from "mongoose";

const proveedorProductoSchema = new mongoose.Schema({
    proveedor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    },
    producto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    precio_unitario: {
        type: Number,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    // Opcionales, ver!?:
    stock: Number,
    fechaActualizacion: { type: Date, default: () => new Date()}   
  },
  {
    collection: 'proveedorProducto'  // <- Aquí pones el nombre exacto de la colección en tu base
});

// Podés asegurarte de que no haya repetidos
proveedorProductoSchema.index({ proveedor_id: 1, producto_id: 1 }, { unique: true });

export const ProveedorProductoModel = mongoose.model('ProveedorProducto', proveedorProductoSchema);