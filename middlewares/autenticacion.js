'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_trabajo_final';

// Metodo que se ejecuta ANTES de la accion del controlador
exports.asegurarAutenticacion = function( req, res, next ){
     
    
    // if( !req.headers.autorizacion ){
    if( !req.headers.authorization ){
        return res.status(403).send( { message: 'La petición no tiene la cabecera de autenticación' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); // Quitamos las comillas

    try {
        var payload = jwt.decode(token, secret);
        
        if( payload.exp <= moment().unix()){
            return res.status(401).send( { message: 'El token ha expirado' });
        }


    } catch (error) {
        console.log( error );
        return res.status(404).send( { message: 'El token no válido' });
    }

    // Tenemos disponible todo el usuario en el método que use el middlewares
    req.usuario = payload;

    next();
};