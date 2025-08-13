'use strict'

import mongoose from 'mongoose';

const vendedorSchema = new mongoose.Schema({
    apellido_nombre: {
        type: String,
        required: true
    },
    zona_cubierta: { // Zona que cubre del pais, pueblo o región en la venta
        type: String
    },
});

export const VendedorModel = mongoose.model('Vendedor', vendedorSchema);