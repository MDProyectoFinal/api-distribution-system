'use strict'

var express = require('express');
var bodyParser = require('body-parser');

// Configurar la aplicación
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Convierte a objeto json los datos o peticiones q nos llegan por http

// Cargar rutas
var usuario_rutas = require('./rutas/usuario');
var persona_rutas = require('./rutas/persona');


// Configurar cabeceras http (Para evitar controles de aceso)
app.use( ( req, res, next ) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitimos acceso a todos los dominios
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
    next();

});

// Rutas base
app.use('/api', usuario_rutas); 
app.use('/api', persona_rutas);

// app.get('/prueba', function(req, res){
//     res.status(200).send({ message: 'Bienvenido a la app del Proyecto Final de ISI' })
// });


module.exports = app;