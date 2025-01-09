'use strict'

import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
    razon_social: { type: String, required: true },
    cuit: { 
        type: String, 
        required: true,
        match: /^[0-9]{6,}$/ // Expresión regular para al menos 6 dígitos    
    },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    email: { 
        type: String, 
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Expresión regular para validar email
    },
    activo: { type: Boolean, default: true },
    nota_adicional: { type: String, default: 'Ej.: A dicho proveedor se le paga de contado'}
});

// TODO: Ver de agregar la dirección de la página web del proveedor???

export const ProveedorModel = mongoose.model('Proveedor', proveedorSchema);