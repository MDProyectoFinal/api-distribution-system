'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PromocionSchema = Schema({
    descripcion: String,
    fecha_desde: Date,
    fecha_hasta: Date,
    estado: String // Podria ser un bit y tener una clase "tipo_promocion"
})

module.exports = mongoose.model('Promocion', PromocionSchema);