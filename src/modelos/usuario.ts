'use strict'

import { Schema } from "mongoose";
//var mongoose = require('mongoose');

import mongoose from 'mongoose';


// VER SI ES NECESARIO!!!
export interface IUsuario extends Document {
    _id: any, // Ver si BORRARLO. OJO!!
    persona: String, // { type: Schema.ObjectId, ref: 'Persona' },
    nombre_usuario: String,    
    clave: String,  
    email: String,
    rol: String, // Sería el Tipo de Usuario
    imagen: String,
    fecha_registro: Date,
    fecha_ultimo_inicio_sesion: Date 
}

const UsuarioSchema: Schema = new Schema({
    _id: { type: Schema.ObjectId, require: true },
    persona: { type: String, require: true }, // { type: Schema.ObjectId, ref: 'Persona' },
    nombre_usuario: { type: String, require: true },    
    clave: { type: String, require: true },  
    email: { type: String, require: true },
    rol: { type: String, require: true }, // Sería el Tipo de Usuario
    rol2: { type: String, enum: ['ADMIN','USER'], default: 'USER' }, // OJO!!! Ver si funciona
    imagen: { type: String, require: true },
    fecha_registro: { type: Date, default: new Date() }, // Ver si funciona
    fecha_ultimo_inicio_sesion: { type: Date, default: new Date() } // OJO!!! Ver si funciona
})

//var Schema = mongoose.Schema;

// var UsuarioSchema = Schema({
//     persona: String, // { type: Schema.ObjectId, ref: 'Persona' },
//     nombre_usuario: String,    
//     clave: String,  
//     email: String,
//     rol: String, // Sería el Tipo de Usuario
//     imagen: String,
//     fecha_registro: Date,
//     fecha_ultimo_inicio_sesion: Date       
// })

export const Usuarioodel = mongoose.model('Usuario', UsuarioSchema);

// module.exports = mongoose.model('Usuario', UsuarioSchema);

