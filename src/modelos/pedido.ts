'use strict'

import mongoose from 'mongoose'
import { Schema } from 'mongoose'

let PedidoItemSchema = new mongoose.Schema({
  idProducto: { type: Schema.ObjectId, required: true, ref: 'Producto' },
  cantidad: { type: Number, required: true, min: [1, 'La cantidad no puede ser menor a 1'] },
  precio: { type: Number, required: true }, // No estoy seguro guardarlo en este punto u obtenerlo de un histórico de precioes
  total: { type: Number, required: true }, // No estoy seguro de guardar esto porque es un atributo calculado
})

const pedidoSchema = new mongoose.Schema({
  fecha_alta_pedido: { type: Date, required: true, default: new Date() },
  estado: { type: String, required: true },
  cliente: { type: Schema.ObjectId, required: true, ref: 'Cliente' },
  items: [PedidoItemSchema],
  subtotal: { type: Number, default: 0 },
})

export const PedidoModel = mongoose.model('Pedido', pedidoSchema)
