'use strict'

import mongoose from "mongoose";

const tipoProductoSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true,
        enum: ['Snack Saludable', 'Snack Común', 'Gaseosa'], // Ver el tema de los tipo de productos que pensamos
        default: 'Snack Saludable'
    }
});

export const TipoProductoModel = mongoose.model('TipoProducto', tipoProductoSchema);