import express from 'express'
import { crearPreferenciaPago } from '../controladores/controladorPago';

export const router = express.Router()

router.post('/', crearPreferenciaPago);
