import { descargarManualUsuario } from '../controladores/controladorSoporte'
import express from 'express'
var md_aute = require('../middlewares/autenticacion');

export const router = express.Router()

router.get('/', md_aute.asegurarAutenticacion, descargarManualUsuario)