'use strict'

var express = require('express');
var PersonaController = require('../controladores/persona')

// var api = express.Router();
var md_aute = require('../middlewares/autenticacion');

// var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros

export const router = express.Router()

router.get('/pruebas-persona', PersonaController.pruebasPersona);
router.post('/guardar-persona', PersonaController.guardarPersona);
router.get('/obtener-persona/:id', md_aute.asegurarAutenticacion, PersonaController.obtenerPersona);
router.put('/actualizar-persona/:id', md_aute.asegurarAutenticacion, PersonaController.actualizarPersona);
router.post('/prueba-codigo-dev', PersonaController.pruebaCodigoDev);
router.post('/eliminar-persona/:id', md_aute.asegurarAutenticacion, PersonaController.eliminarPersona)

// module.exports = router;