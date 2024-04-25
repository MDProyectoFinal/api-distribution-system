'use strict'

var express = require('express');
var UsuarioController = require('../controladores/usuario')

var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros
var md_subida = multipart({ uploadDir: './subidas/usuarios' }); // Acá subimos todas las imagens de usuarios

//var router = express.Router();
var md_aute = require('../middlewares/autenticacion');

export const router = express.Router();

router.get('/probando-controlador', UsuarioController.pruebasControlador);
router.post('/guardar-usuario', UsuarioController.guardarUsuario);
router.post('/loguear-usuario', UsuarioController.loguearUsuario);
router.put('/actualizar-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.actualizarUsuario);
router.post('/actualizar-imagen-usuario/:id', [md_aute.asegurarAutenticacion, md_subida], UsuarioController.actualizarImagen);
router.get('/obtener-archivo-imagen/:archivoImagen', UsuarioController.obtenerArchivoImagen);
router.delete('/eliminar-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.eliminarUsuario);
router.get('/obtener-usuarios', UsuarioController.obtenerUsuarios );
router.get('/obtener-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.obtenerUsuarioPorId );

// module.exports = router;