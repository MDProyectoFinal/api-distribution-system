'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

// Conectar local a mi Mongo DB
// mongoose.connect('mongodb://0.0.0.0:27017/rosario_snack').then( 

// Conectar Mongo DB Atlas Free Online
mongoose.connect('mongodb+srv://proyectofinalisiutn:ProyectoFinalIsiUtn2023@clusterbd.q87qmbk.mongodb.net/rosario_snack').then( 
    res => {
        console.log(`La conexión a la base de datos está funcionando correctamente..`);  
        
        app.listen(port, function(){
            console.log('Servidor del api rest de proyecto final escuchando en http://localhost:' + port );
        })
    },
    err => console.error(`Ha habido un error: ${err}`),    
);

