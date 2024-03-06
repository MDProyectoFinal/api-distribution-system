'use strict'

var express = require('express');
var LogController = require('../controladores/log')


var api = express.Router();

// var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros

api.get('/obtener-logs', LogController.obtenerLogs);
api.post('/guardar-log', LogController.guardarLog);

module.exports = api;