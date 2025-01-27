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
    reseteo_password_token: String | null,
    reseteo_password_expira: Number | null
}

//const UsuarioSchema: Schema = new Schema<IUsuario>({
// const UsuarioSchema: IUsuario = new Schema({
const UsuarioSchema: Schema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    persona: { type: mongoose.Types.ObjectId, require: true }, // { type: Schema.ObjectId, ref: 'Persona' },
    nombre_usuario: { type: String, require: [ true, 'Nombre es requerido'] },
    clave: { type: String, require: [ true, 'Clave es requerida'] },
    email: { type: String, require: [ true, 'Email es requerido'], unique: true }, // unique determina q no vamos a tener emails duplicados en BD    
    rol: { type: String, enum: ['ADMIN','USER'], default: 'USER' }, // VER!! Puede tener mas de un rol a la vez? Debemos usar [String]
    imagen: { type: String },
    fecha_registro: { type: Date, default: Date.now }, // Ver si funciona
    fecha_ultimo_inicio_sesion: { type: Date, default: Date.now }, // OJO!!! Ver si funciona
    baja: { type: Boolean, default: false },
    fecha_baja: { type: Date, default: null },
    reseteo_password_token: { type: String, default: '' },
    reseteo_password_expira: { type: Number, default: null } // VER EL DEFAULT!!
})
export const UsuarioModel = mongoose.model<IUsuario>('Usuario', UsuarioSchema);