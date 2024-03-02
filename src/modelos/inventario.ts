'use strict'


import mongoose from "mongoose";
import { Schema } from "mongoose";

const inventarioSchema = new mongoose.Schema({
    id_producto: { type: Schema.ObjectId, ref: 'Producto' },
    cantidad_disponible: { type: Number, required: true, default: 0 },
    cantidad_productos_vendidos: { type: Number, required: true, default: 0 }
});

export const InventarioModel = mongoose.model('Inventario', inventarioSchema);


// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var InventarioSchema = Schema({
//     id_producto: { type: Schema.ObjectId, ref: 'Producto' },
//     cantidad_disponible: Number,
//     cantidad_productos_vendidos: Number
// })

// module.exports = mongoose.model('Inventario', InventarioSchema);