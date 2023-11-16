'use strict'

var fs = require('fs');
var path = require('path');
const moment = require('moment');

var Persona = require('../modelos/persona');
var Usuario = require('../modelos/usuario');

// const mongoose = require('mongoose'); // Si estás utilizando require

const { guardarUsuario } = require('./usuario');
const { debug } = require('console');
// const { params } = require('../app');

function pruebasPersona( req, res ){
    res.status(200).send({
        message: 'Probando una acción del controlador de personas del api rest con Node y MongoDB'
    });
}

function pruebaCodigoDev( req, res ){
    // Obtener la fecha actual
    const fechaActual = moment();
    const fecha = new Date();
    console.log(fecha);

    // Cambiar el formato de la fecha actual
    const fechaFormateada = fechaActual.format('DD-MM-YYYY');
    const fechaFormateada2 = `${fecha.getDate()}-${(fecha.getMonth()+ 1).toString().padStart(2, '0')}-${fecha.getFullYear()}`;

    // Imprimir la fecha formateada
    console.log(fechaFormateada);
    console.log(fechaFormateada2);
}

// Llamar dicho metodo desde el guardar usuario
async function guardarPersona( req, res ){
    
    var personaGuardada = null;

    var persona = new Persona();
    var usuario = new Usuario();
    var params = req.body;

    // Obtener la fecha actual
    const fechaActual = new Date();
      
    // Datos del USUARIO
    usuario.persona = null;
    usuario.nombre_usuario = params.nombre_usuario;
    usuario.clave = (params.clave == null ? params.password : params.clave);
    usuario.rol = params.rol;
    usuario.email = (params.email == null ? params.correo_electronico : params.email);
    usuario.imagen = null;   
    usuario.fecha_registro = fechaActual;
    usuario.fecha_ultimo_inicio_sesion = fechaActual;

    // Datos de la PERSONA
    persona.nombre = (params.nombre == null ? params.persona.nombre : params.nombre);
    persona.apellido = (params.apellido == null ? params.persona.apellido : params.apellido);
    persona.fecha_nacimiento = (params.fecha_nacimiento == null ? params.persona.fecha_nacimiento : params.fecha_nacimiento);
    persona.direccion = (params.direccion == null ? params.persona.direccion : params.direccion);
    persona.telefono = (params.telefono == null ? params.persona.telefono : params.telefono);   
        
    try {

        if( persona.nombre != '' && persona.apellido != '' && persona.fecha_nacimiento != '' && persona.direccion != '' && persona.telefono != '' ){                 
                
                // NUEVO
                personaGuardada = await persona.save();                
                console.log('persona guardada!!');                
                
                // Asignamos el id de la persona ingresada
                usuario.persona = personaGuardada.id

                // ** Guardamos el usuario asociado **
                const usuarioGuardado = await guardarUsuario( usuario, res );                
                console.log(usuarioGuardado);
                
                debugger;
                if(usuarioGuardado && personaGuardada){
                    res.status(200).send({ persona: personaGuardada, usuario: usuarioGuardado });
                }
                            
        }else{
            throw new Error('Complete todos los campos'); // Lanzar un error controlado
            // res.status(200).json( { message: 'Complete todos los campos' });
        }

    } catch (error) {        
        console.error('Error al guardar la persona:', error);

        // Borramos la persona ingresada anteriormente si ocurre una falla
        if( personaGuardada ){
            const personaBorrada = await Persona.deleteOne({ _id: personaGuardada.id })
        }       

        res.status(500).json({ mensaje: 'Error al guardar la persona: ' + error });
        return;
    }
}

async function obtenerPersona( req, res ){

    var personaId = req.params.id; // de la URL viene
    var update = req.body;
    
    try {
        const personaEncontrada = await Persona.find({ "_id": personaId });
        console.log( personaEncontrada );

        if( personaEncontrada.length == 0 ){
            res.status(404).send({ message: 'Persona no existe' });
        }else{
            return res.status(200).send({ user: personaEncontrada, message: 'Persona encontrada' });
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener la persona' });
    }
}

async function actualizarPersona( req, res ){
    
    var personaId = req.params.id; // de la URL viene
    var update = req.body;

    debugger;

    if( personaId != req.usuario.sub ){
        return res.status(500).send({ message: 'No tienes permisos para actualizar este usuario' });
    }

    try {
        const userEncontrado = await Usuario.findByIdAndUpdate( userId, update );    

        if( userEncontrado ){
            return res.status(200).send({ user: userEncontrado });    
        }else{
            res.status(404).send({ message: 'No se ha podido encontrar y actualizar el usuario'});
        }
        
    } catch (error) {
        return res.status(500).send({ message: 'Error al actualzar el usuario' + error });
    }
}

module.exports = {
    pruebasPersona,
    guardarPersona,
    obtenerPersona,
    pruebaCodigoDev    
};