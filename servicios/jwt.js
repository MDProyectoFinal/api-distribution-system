'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_trabajo_final';

// Recibe un usuario y genera un token
exports.createToken = function( usuario ){
    
    var payload = {
        sub: usuario._id, // id del documento en BD
        persona: usuario.persona,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        clave: usuario.clave,
        rol: usuario.rol,
        imagen: usuario.imagen,
        fecha_registro: usuario.fecha_registro,
        fecha_ultimo_inicio_sesion: usuario.fecha_ultimo_inicio_sesion,
        iat: moment().unix(), // Fecha inicial/creacion -> Tiempo actual en formato timestamp
        exp: moment().add(30, 'days').unix() // Fecha de expiracion
    }

    return jwt.encode( payload, secret );
};