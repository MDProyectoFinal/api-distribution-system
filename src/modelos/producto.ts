'use strict'

import mongoose, { Model } from 'mongoose'
import { Promocion, PromocionModel } from './promocion'

const productoSchema = new mongoose.Schema<Producto>({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String },
  precio_unitario: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  tipoProducto: { type: mongoose.Schema.Types.ObjectId, required: true },
  promociones: [PromocionModel.schema],
})



export const ProductoModel = mongoose.model<Producto>('Producto', productoSchema)

export interface Producto {
  _id?: mongoose.Types.ObjectId
  nombre: string
  descripcion: string
  imagen?: string
  precio_unitario: number
  stock: number
  tipoProducto: mongoose.Types.ObjectId
  promociones: Promocion[]
}


