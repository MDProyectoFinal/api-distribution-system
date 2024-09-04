'use strict'

import mongoose from "mongoose";

// Define schema base con columna discriminadora
const promocionBaseSchema = new mongoose.Schema<IPromocionBase>({
  idProducto: { type: mongoose.Schema.Types.ObjectId, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  activo: { type: Boolean, default: true }
}, { discriminatorKey: 'tipoPromocion' });

promocionBaseSchema.methods.aplicar= function(precio: number): number {
  throw new Error('Método aplicar debe ser implementado por las subclases');
};

export const PromocionBaseModel = mongoose.model('PromocionBase', promocionBaseSchema);

// Promoción por valor
const promocionValorSchema = new mongoose.Schema<IPromocionValor>({
  valor: { type: Number, required: true }
});

// Promoción por porceentaje
const promocionPorcentajeSchema = new mongoose.Schema<IPromocionPorcentaje>({
  porcentaje: { type: Number, required: true, min: 0, max: 100 }
});

// Cada Tipo de Promoción define el algoritmo que aplica para calcular el precio
promocionValorSchema.methods.aplicar = function(precioProducto: number): number {
  return Math.max(0, precioProducto - this.valor);
};

promocionPorcentajeSchema.methods.aplicar = function(precioProducto: number): number {
  return precioProducto * (1 - this.porcentaje / 100);
};


export const PromocionValorModel = PromocionBaseModel.discriminator<IPromocionValor>('PromocionValor', promocionValorSchema);
export const PromocionPorcentajeModel = PromocionBaseModel.discriminator<IPromocionPorcentaje>('PromocionPorcentaje', promocionPorcentajeSchema);


interface IPromocionBase {
  idProducto: mongoose.Types.ObjectId;
fecha_inicio: Date;
fecha_fin: Date;
activo: boolean;

aplicar(precioProducto: number): number;
}

interface IPromocionValor extends IPromocionBase {
tipoPromocion: 'PromocionValor';
valor: number;
}

interface IPromocionPorcentaje extends IPromocionBase {
tipoPromocion: 'PromocionPorcentaje';
porcentaje: number;
}

export type IPromocion = IPromocionValor | IPromocionPorcentaje;