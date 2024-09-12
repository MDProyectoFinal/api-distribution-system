'use strict'

import multer from "multer";
//const upload = multer({ dest: './uploads/' });

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

// var api = express.Router();
var md_aute = require('../middlewares/autenticacion');

// var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros

export const router = express.Router()

router.get('/pruebas-persona', PersonaController.pruebasPersona);
router.post('/guardar-persona', PersonaController.guardarPersona);
router.get('/obtener-persona/:id', md_aute.asegurarAutenticacion, PersonaController.obtenerPersona);
router.post('/actualizar-persona/:id', upload.single('image'), md_aute.asegurarAutenticacion, PersonaController.actualizarPersona);
router.post('/prueba-codigo-dev', PersonaController.pruebaCodigoDev);
router.post('/eliminar-persona/:id', md_aute.asegurarAutenticacion, PersonaController.eliminarPersona)
router.patch('/:id',md_aute.asegurarAutenticacion, PersonaController.actualizacionParcial)

// module.exports = router;