'use strict'

import mongoose from "mongoose";

const tipoPromocionSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true,
        enum: ['Porcentaje', 'Valor Fijo',] // Ver el tema de los tipo de productos que pensamos
    }
});

export const TipoPromocionModel = mongoose.model('TipoPromocion', tipoPromocionSchema);

