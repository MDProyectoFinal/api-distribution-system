'use strict'


import mongoose from "mongoose";

const productoSchema = new mongoose.Schema<Producto>({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String },
    precio_unitario: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    tipoProducto: { type: mongoose.Schema.Types.ObjectId, required: true }
  });

export const ProductoModel = mongoose.model('Producto', productoSchema);

export interface Producto {
  _id?: mongoose.Types.ObjectId;
  nombre: string;
  descripcion: string;
  imagen?: string;
  precio_unitario: number;
  stock: number;
  tipoProducto: mongoose.Types.ObjectId;
}