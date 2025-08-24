'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_trabajo_final';

import { IUsuario } from '../modelos/usuario';

// Recibe un usuario y genera un token
exports.createToken = function( usuario: IUsuario ){

    var payload = {
        sub: usuario._id, // id del documento en BD. Ver que hacer acá!
        persona: usuario.persona,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.rol,
        imagen: usuario.imagen,
        iat: moment().unix(), // Fecha inicial/creacion -> Tiempo actual en formato timestamp
        exp: moment().add(30, 'days').unix() // Fecha de expiracion
    }

    return jwt.encode( payload, secret );
};