'use strict'

var express = require('express');
var LogController = require('../controladores/log')
export const router = express.Router()

router.get('/obtener-logs', LogController.obtenerLogs);
router.post('/guardar-log', LogController.guardarLog);