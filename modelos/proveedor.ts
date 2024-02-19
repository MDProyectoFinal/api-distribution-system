'use strict'

import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    cuil: { type: String, required: true },
    dni: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    email: { type: String, required: true }
});

export const ProveedorModel = mongoose.model('Proveedor', proveedorSchema);

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var ProveedorSchema = Schema({    
//     apellido_nombre: String,
//     cuil: String,
//     dni: String,
//     telefono: String,
//     direccion: String,
//     email: String    
// })

// module.exports = mongoose.model('Proveedor', ProveedorSchema);
