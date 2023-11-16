'use strict'

var express = require('express');
var PersonaController = require('../controladores/persona')

var md_aute = require('../middlewares/autenticacion');

var api = express.Router();
var md_aute = require('../middlewares/autenticacion');

// var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros

api.get('/pruebas-persona', PersonaController.pruebasPersona);
api.post('/guardar-persona', PersonaController.guardarPersona);
api.post('/prueba-codigo-dev', PersonaController.pruebaCodigoDev);
api.get('/obtener-persona/:id', md_aute.asegurarAutenticacion, PersonaController.obtenerPersona);

module.exports = api;