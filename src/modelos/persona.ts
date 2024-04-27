'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export interface IPersona extends Document {
    nombre: string | null;
    apellido: String | null,
    fecha_nacimiento: String | null,
    direccion: String | null,
    telefono: String | null
}

const PersonaSchema: IPersona = new Schema({
    nombre: { type: String, require: true }, // Antes decia :string
    apellido: { type: String, require: true },
    fecha_nacimiento: { type: String, require: true },
    direccion: { type: String, require: true },
    telefono: { type: String, require: true }
})

export const PersonaModel = mongoose.model('Persona', PersonaSchema);

// module.exports = mongoose.model('Persona', PersonaSchema);
