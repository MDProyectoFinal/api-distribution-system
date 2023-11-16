'use strict'

var express = require('express');
var UsuarioController = require('../controladores/usuario')

var api = express.Router();
var md_aute = require('../middlewares/autenticacion');

var multipart = require('connect-multiparty'); // sirve para la subida de imagenes o ficheros
var md_subida = multipart({ uploadDir: './subidas/usuarios' }); // Acá subimos todas las imagens de usuarios

api.get('/probando-controlador', md_aute.asegurarAutenticacion, UsuarioController.pruebasControlador);
api.post('/guardar-usuario', UsuarioController.guardarUsuario);
api.post('/loguear-usuario', UsuarioController.loguearUsuario);
api.put('/actualizar-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.actualizarUsuario);
api.post('/actualizar-imagen-usuario/:id', [md_aute.asegurarAutenticacion, md_subida], UsuarioController.actualizarImagen);
api.get('/obtener-archivo-imagen/:archivoImagen', UsuarioController.obtenerArchivoImagen);
api.delete('/eliminar-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.eliminarUsuario);
api.get('/obtener-usuarios', md_aute.asegurarAutenticacion, UsuarioController.obtenerUsuarios );
api.get('/obtener-usuario/:id', md_aute.asegurarAutenticacion, UsuarioController.obtenerUsuario );

module.exports = api;