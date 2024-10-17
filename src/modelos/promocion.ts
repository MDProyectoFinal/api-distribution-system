import mongoose from "mongoose";

const promocionSchema = new mongoose.Schema<Promocion>({
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: false },
    precio: { type: Number, required: true },
    activa: { type: Boolean, required: true }
  });

  export const PromocionModel = mongoose.model<Promocion>('Promocion', promocionSchema);
  export interface Promocion {
    _id?: mongoose.Types.ObjectId
    fecha_inicio: Date
    fecha_fin: Date
    precio: number
    activa: boolean
  }