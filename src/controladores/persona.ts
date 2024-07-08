'use strict'

//const mongoose = require('mongoose');
import mongoose from "mongoose";
import express from 'express'
// import UsuarioModel from "modelos/usuario";
import { IPersona } from "../modelos/persona";

import { PersonaModel } from '../modelos/persona';
import { UsuarioModel } from '../modelos/usuario';
// var PersonaModel = require('../modelos/persona');
// var UsuarioModel = require('../modelos/usuario');

import { ErrorPersonalizado } from "../dominio/errors/error.personalizado";

// var fs = require('fs');
// var path = require('path');
var moment = require('moment');

// var Persona = require('../modelos/persona');
// var Usuario = require('../modelos/usuario');

// const mongoose = require('mongoose'); // Si estás utilizando require

var { guardarUsuario } = require('./usuario');
// const { params } = require('../app');

function pruebasPersona( req:any, res:any ){
    res.status(200).send({
        message: 'Probando una acción del controlador de personas del api rest con Node y MongoDB'
    });
}

function pruebaCodigoDev( req:any, res:any ){
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
async function guardarPersona( req:any, res:any ){

    var personaGuardada = null;

    var persona = new PersonaModel();
    var usuario = new UsuarioModel();
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
                // console.log(usuarioGuardado);

                if(usuarioGuardado && personaGuardada){
                    res.status(200).send({ persona: personaGuardada, usuario: usuarioGuardado });
                }

        }else{
            throw ErrorPersonalizado.badRequest('Complete todos los campos');
            // throw new Error('Complete todos los campos'); // Lanzar un error controlado
            // res.status(200).json( { message: 'Complete todos los campos' });
        }

    } catch (error) {
        console.error('Error al guardar la persona:', error);

        // Borramos la persona ingresada anteriormente si ocurre una falla
        if( personaGuardada ){
            const personaBorrada = await PersonaModel.deleteOne({ _id: personaGuardada.id })
        }

        res.status(500).json({ mensaje: 'Error al guardar la persona: ' + error });
        return;
    }
}

async function obtenerPersona( req:any, res:any ) : Promise<IPersona|undefined>{

    var personaId = req.params.id; // de la URL viene
    var update = req.body;

    try {
        const personaEncontrada = await PersonaModel.find({ "_id": personaId });
        // console.log( personaEncontrada );

        if( personaEncontrada.length == 0 ){
            res.status(404).send({ message: 'Persona no existe' });
        }else{
            return res.status(200).send({ user: personaEncontrada, message: 'Persona encontrada' });
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener la persona' });
    }
}

async function actualizarPersona( req:any, res:any ){

    debugger;
    const personaId = req.params.id; // de la URL viene

    // Asegúrate de que userId sea una cadena de 24 caracteres hexadecimales. Porque sin mandamos "1" por ejemplo explota
    if (!/^[0-9a-fA-F]{24}$/.test(personaId)) {
        // Maneja el caso en el que userId no tiene el formato correcto
        throw new Error( 'El "UserId" no posee el formato correcto (ObjectId) para su búsqueda' );
    }

    // Lo convertidos a tupo ObjectId para respetar el tipo de dato en el Model.
    const personaIdObject = new mongoose.Types.ObjectId(personaId);

    var update = req.body;

    // Validamos que por el Body llegue algún campo a actualizar
    if (Object.keys(update).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    // Compara los datos guardados del usuario autenticado con el personId enviado. Pepe no puede actualizar datos de Juan
    if( personaId != req.usuario.persona ){
        return res.status(500).send({ message: 'No tienes permisos para actualizar este usuario' });
    }

    try {
        // el new: true, devuelve el usuario actualizado. Si es "false" devuelve el usuario previo a la actualizacion
        const personaActualizada = await PersonaModel.findByIdAndUpdate( personaIdObject.toHexString(), update, { new: true } );

        if( personaActualizada ){
            return res.status(200).send({ personaAct: personaActualizada });
        }else{
            res.status(404).send({ message: 'No se ha podido encontrar y actualizar la persona'});
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al actualizar la persona' + error });
    }
}

const actualizacionParcial = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params
      const persona ={ nombre: req.body.nombre, apellido: req.body.apellido, telefono : req.body.telefono, direccion : req.body.direccion}
      const personaModificada =  await PersonaModel.findOneAndUpdate({ _id: id }, persona)

      if (!personaModificada) {
        return res.sendStatus(404)
      }

      return res.sendStatus(204)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

async function eliminarPersona ( req:Request, res: Response){

    // Method not implemented
}

module.exports = {
    pruebasPersona,
    guardarPersona,
    obtenerPersona,
    actualizarPersona,
    eliminarPersona,
    pruebaCodigoDev,
    actualizacionParcial
};