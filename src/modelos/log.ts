'use strict'

import mongoose from "mongoose";
import { Schema } from "mongoose";

export enum LogNivelImportancia {
    low = 'low',
    medium = 'medium',
    high = 'high'
};

export interface ILog {
    mensaje: String, 
    origen: String, 
    nivel: LogNivelImportancia,
    creacion: Date,
}

const logSchema: Schema = new mongoose.Schema({
    mensaje: { type: String, required: true },
    origen: { type: String, required: true },
    nivel: { 
        type: String,       
        enum: ['low','medium','high'],
        default: 'low'
    },
    fecha_creacion: { type: Date, default: new Date() },
});

export const LogModel = mongoose.model('Log', logSchema);