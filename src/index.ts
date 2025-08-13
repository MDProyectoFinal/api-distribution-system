'use strict'

import { ILog, LogNivelImportancia } from "./modelos/log";

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 5000;

var { LogController } = require('./controladores/log');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

// Conectar Mongo DB Atlas Free Online
mongoose.connect(process.env.MONGO_URL_LOCAL).then(
    async () => {
        console.log(`La conexión a la base de datos está funcionando correctamente..`);

        await app.listen(port, function(){
            console.log(`Servidor del api rest de proyecto final escuchando en ${process.env.URL_ACTUAL}:${process.env.PORT} `);
        })

        // Registro de LOGs de la conexión
        try {
            // Registramos un log de de conexión exitosa de la BD
            const newLog: ILog = {
                mensaje: 'La conexión a la base de datos está funcionando correctamente..',
                origen: 'index.ts',
                nivel: LogNivelImportancia.low,
                creacion: new Date()
            };
            await LogController.guardarLog(newLog);

        } catch (error) {
            console.error('Error al guardar el log:', error);
        }

    },
    (err: any) => console.error(`Ha habido un error: ${err}`),
);



