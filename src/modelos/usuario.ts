'use strict'

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUsuario extends Document {
    //_id: typeof Schema.ObjectId; // Ver si BORRARLO. OJO!!
    persona: String | null, // { type: Schema.ObjectId, ref: 'Persona' },
    nombre_usuario: String | null,
    clave: String | null,
    email: String | null,
    rol: String | null, // Sería el Tipo de Usuario
    imagen: String | null,
    fecha_registro: Date | null,
    fecha_ultimo_inicio_sesion: Date | null,
    baja: boolean | null,
    fecha_baja: Date | null,
}

//const UsuarioSchema: Schema = new Schema<IUsuario>({
// const UsuarioSchema: IUsuario = new Schema({
const UsuarioSchema: Schema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    persona: { type: mongoose.Types.ObjectId, require: true }, // { type: Schema.ObjectId, ref: 'Persona' },
    nombre_usuario: { type: String, require: true },
    clave: { type: String, require: true },
    email: { type: String, require: true },
    rol: { type: String, enum: ['ADMIN','USER'], default: 'USER' }, // OJO!!! Ver si funciona
    imagen: { type: String, require: true },
    fecha_registro: { type: Date, default: Date.now }, // Ver si funciona
    fecha_ultimo_inicio_sesion: { type: Date, default: Date.now }, // OJO!!! Ver si funciona
    baja: { type: Boolean, default: false },
    fecha_baja: { type: Date, default: null }
})
export const UsuarioModel = mongoose.model<IUsuario>('Usuario', UsuarioSchema);