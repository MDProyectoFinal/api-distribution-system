import { verificarCaptcha } from 'middlewares/validadorCaptcha';
'use strict'
var express = require('express');
var UsuarioController = require('../controladores/usuario')

var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros
var md_subida = multipart({ uploadDir: './subidas/usuarios' }); // Acá subimos todas las imagens de usuarios

//var router = express.Router();
var md_aute = require('../middlewares/autenticacion');
const md_captcha = require('../middlewares/validadorCaptcha');

export const router = express.Router();

//router.get('/probando-controlador', UsuarioController.pruebasControlador);
router.post('/guardar-usuario', UsuarioController.guardarUsuario);
router.post('/loguear-usuario', md_captcha.verificarCaptcha('login', 0.5),  UsuarioController.loguearUsuario);
router.put('/actualizar-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.actualizarUsuario);
router.post('/actualizar-imagen-usuario/:id', [md_aute.asegurarAutenticacion, md_subida], UsuarioController.actualizarImagen);
router.get('/obtener-archivo-imagen/:archivoImagen', UsuarioController.obtenerArchivoImagen);
router.get('/obtener-avatar-usuario/:idUsuario', UsuarioController.obtenerAvataUsuario);
router.delete('/eliminar-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.eliminarUsuario);
router.get('/obtener-usuarios', UsuarioController.obtenerUsuarios );
router.get('/obtener-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.obtenerUsuarioPorId );
router.get('/obtener-usuarios/nombre/:nombreUsuario', md_aute.asegurarAutenticacion, UsuarioController.obtenerUsuarioPorNombreUsuario );
router.post('/olvide-mi-password', UsuarioController.olvideMiPassword)
router.post('/reset-password', UsuarioController.resetPassword)


// module.exports = router;