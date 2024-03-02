'use strict'

import mongoose from "mongoose";
import { Schema } from "mongoose";

const carroDeComprasSchema = new mongoose.Schema({
    id_usuario: { type: Schema.ObjectId, ref: 'Usuario', required: true },
    id_producto: { type: Schema.ObjectId, ref: 'Producto', required: true },
    cantidad_productos: { type: Number, required: true, default: 0 }
});

export const CarroDeComprasModel = mongoose.model('CarroDeCompras', carroDeComprasSchema);


// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var CarroDeComprasSchema = Schema({
//     id_usuario: { type: Schema.ObjectId, ref: 'Usuario' },
//     id_producto: { type: Schema.ObjectId, ref: 'Producto' },
//     cantidad_productos: Number
// })

// module.exports = mongoose.model('CarroDeCompras', CarroDeComprasSchema);