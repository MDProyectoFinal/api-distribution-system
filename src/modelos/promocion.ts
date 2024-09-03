'use strict'

import mongoose from "mongoose";
import { extendSchema } from "utilidades/extendSchema";
import { productoSchema } from "./producto";

  const promocionSchema = extendSchema(productoSchema, {
    valor: { type: Number, required: true },
    tipoPromocion:  { type: mongoose.Types.ObjectId, required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    activo: { type: Boolean, default: true }
  }  )

export const PromocionModel = mongoose.model('Promocion', promocionSchema);