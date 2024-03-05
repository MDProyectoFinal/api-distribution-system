'use strict'

import { ILog, LogNivelImportancia } from "./modelos/log";

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 5000;

var { LogController } = require('./controladores/log');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

// Conectar local a mi Mongo DB
//mongoose.connect('mongodb://0.0.0.0:27017/rosario_snack').then(

// Conectar Mongo DB Atlas Free Online
mongoose.connect(process.env.MONGO_URL_LOCAL).then(
    async () => {
        console.log(`La conexión a la base de datos está funcionando correctamente..`);

        await app.listen(port, function(){
            console.log('Servidor del api rest de proyecto final escuchando en ' + process.env.URL_ACTUAL + ':' + process.env.PORT );
        })
    },
    (err: any) => console.error(`Ha habido un error: ${err}`),
);



