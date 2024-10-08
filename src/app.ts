'use strict'

require('dotenv').config();

import express from 'express';
//var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Nos permite el uso de x-www-form-unrencoded de Postman
app.use(bodyParser.json()); // Convierte a objeto json los datos o peticiones q nos llegan por http

// Cargar rutas
const usuario_rutas = require('./rutas/usuario');
const persona_rutas = require('./rutas/persona');
const rutaTipoProducto = require('./rutas/rutaTipoProducto')
const rutaProducto = require('./rutas/rutaProducto')
const rutaPedidos = require('./rutas/rutaPedidos')
const rutaPedidosClientes = require('./rutas/rutaPedidosClientes')
const rutaPromociones = require('./rutas/rutaPromociones')

// Configurar cabeceras http (Para evitar controles de aceso)
app.use( ( req: any, res: any, next: any ) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitimos acceso a todos los dominios
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');

    next();
});

// Rutas base
app.use('/api/usuarios', usuario_rutas.router );
app.use('/api/personas', persona_rutas.router );
app.use('/api/tiposProductos', rutaTipoProducto.router);
app.use('/api/productos', rutaProducto.router);
app.use('/api/pedidos', rutaPedidos.router);
app.use('/api/clientes', rutaPedidosClientes.router);
app.use('/api/productos/', rutaPromociones.router);
// app.get('/prueba', function(req, res){
//     res.status(200).send({ message: 'Bienvenido a la app del Proyecto Final de ISI' })
// });


module.exports = app;