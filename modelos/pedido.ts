'use strict'

import mongoose from "mongoose";
import { Schema } from "mongoose";

const pedidoSchema = new mongoose.Schema({
    fecha_alta_pedido: { type: Date, required: true, default: new Date() },
    estado: { type: String, required: true },
    cliente: { type: Schema.ObjectId, required: true, ref: 'Cliente' },
    producto: { type: Schema.ObjectId, required: true, ref: 'Producto' }
});

export const PedidoModel = mongoose.model('Pedido', pedidoSchema);

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var PedidoSchema = Schema({
//     fecha_alta_pedido: Date,
//     estado: String,
//     cliente: { type: Schema.ObjectId, ref: 'Cliente' },
//     producto: { type: Schema.ObjectId, ref: 'Producto' }
// })

// module.exports = mongoose.model('Pedido', PedidoSchema);