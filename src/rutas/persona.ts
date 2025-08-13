'use strict'

import multer from "multer";

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

var express = require('express');
var PersonaController = require('../controladores/persona')

var md_aute = require('../middlewares/autenticacion');
const md_captcha = require('../middlewares/validadorCaptcha');

export const router = express.Router()

router.get('/pruebas-persona', PersonaController.pruebasPersona);
router.post('/guardar-persona', md_captcha.verificarCaptcha('registro', 0.5), PersonaController.guardarPersona);
router.get('/obtener-persona/:id', md_aute.asegurarAutenticacion, PersonaController.obtenerPersona);
router.post('/actualizar-persona/:id', upload.single('image'), md_aute.asegurarAutenticacion, PersonaController.actualizarPersona);
router.post('/prueba-codigo-dev', PersonaController.pruebaCodigoDev);
router.post('/eliminar-persona/:id', md_aute.asegurarAutenticacion, PersonaController.eliminarPersona)
router.patch('/:id',md_aute.asegurarAutenticacion, PersonaController.actualizacionParcial)