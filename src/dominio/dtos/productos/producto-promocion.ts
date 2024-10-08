import { Promocion } from "modelos/promocion";
import mongoose from "mongoose";

export interface ProductoConPromocionDTO{
    _id: mongoose.Types.ObjectId;
    nombre: string;
    descripcion: string;
    imagen?: string;
    precio_unitario: number;
    stock: number;
    tipoProducto: mongoose.Types.ObjectId;
    promocionActiva?: Promocion;
}