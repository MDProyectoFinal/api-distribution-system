'use strict'


import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String },
    precio_unitario: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    categoria: { type: String, required: true }
});

export const ProductoModel = mongoose.model('Producto', productoSchema);