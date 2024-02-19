'use strict'

import mongoose from "mongoose";

const tipoProductoSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true,
        enum: ['Snack Saludable', 'Snack Común',] // Ver el tema de los tipo de productos que pensamos
    }
});

export const TipoProductoModel = mongoose.model('TipoProducto', tipoProductoSchema);



//var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var TipoProductoSchema = Schema({
//     descripcion: String
// })

// module.exports = mongoose.model('TipoProducto', TipoProductoSchema);