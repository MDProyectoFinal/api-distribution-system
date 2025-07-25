'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

import { Request, Response } from 'express';

// import Usuario from '../../src/modelos/usuario';
// var Usuario = require('../modelos/usuario')  //('../modelos/usuario')
// var Persona = require('../modelos/persona');
import { PersonaModel } from '../modelos/persona';
import { IUsuario, UsuarioModel } from '../modelos/usuario';

const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Enviar correos electrónicos

var jwt = require('../servicios/jwt');

import mongoose from 'mongoose';
import moment from 'moment';
import { RegistroUsuarioDto } from '../dominio/dtos/auth/registro-usuario-dto';
import { ErrorPersonalizado } from "../dominio/errors/error.personalizado";
import { bcryptAdapter } from '../config';
import { LoginUsuarioDto } from '../dominio';
import express from 'express';


async function pruebasControlador( req: Request, res: Response ){

    console.log(moment().toDate());

    // ************* Actualizar todos los registros existentes para establecer 'eliminado' en 'false'
    // try {
    //     const result = await UsuarioModel.updateMany({}, { $set: { baja: false, fecha_baja: null } });
    //     console.log("Operación exitosa:", result);

    //     res.status(200).send({
    //         message: 'Probando una acción del controlador de usuarios del api rest con Node y MongoDB'
    //     });

    // } catch (error) {
    //     console.error("Error al actualizar:", error);
    // }

    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del api rest con Node y MongoDB'
    });

}

async function guardarUsuario( req:any, res:any ){

    // Continuamos el circuito anterior normalmente
    var usuario = new UsuarioModel();
    var [persona = null, nombre_usuario = null, clave = null, email = null, rol = null, imagen = null, fecha_registro = new Date(), fecha_ultimo_inicio_sesion = new Date() ] = [null, null, null, null, null, null, null, null];

    let fecha_actual: Date | null = new Date();

    // Vemos si viene por el body (metodo directo) o si viene desde el "Guardar Persona"
    if (typeof req.body === 'undefined' || req.body === '') {
        // Si viene desde el método GuardarPersona
        //usuario._id = new mongoose.Types.ObjectId();
        persona = req.persona;
        nombre_usuario = req.nombre_usuario;
        clave = req.clave;
        email = req.email;
        rol = req.rol;
        imagen = req.imagen;
        fecha_registro = req.fecha_registro;
        fecha_ultimo_inicio_sesion = req.fecha_ultimo_inicio_sesion;
    }else{
        // Si el método es llamado directo. Desde Postman por ejemplo
        //usuario._id = new mongoose.Types.ObjectId();
        persona = req.body.persona;
        nombre_usuario = req.body.nombre_usuario;
        clave = req.body.clave;
        email = req.body.email;
        rol = req.body.rol;
        fecha_registro = fecha_actual;
        fecha_ultimo_inicio_sesion = fecha_actual;
    }

    // NUEVO: Validacion de los campos del lado del back.
    const [error, registroDto] = RegistroUsuarioDto.create( { nombre_usuario, clave, email} );
    if ( error ) throw ErrorPersonalizado.badRequest( error );    //return  res.status(400).json( {error} );

    // PARA TEST
    // console.log( "persona: " + persona );
    // console.log( "nombre_usuario: " + nombre_usuario );
    // console.log( "clave: " + clave );
    // console.log( "email: " + email );
    // console.log( "rol: " + rol );
    // console.log( "imagen: " + imagen );
    // console.log( "fecha_registro: " + fecha_registro );
    // console.log( "fecha_ultimo_inicio_sesion: " + fecha_ultimo_inicio_sesion );

    // Llenamos el objeto "usuario" con los datos del mismo, para guardarlo
    usuario.persona = persona;
    usuario.nombre_usuario = nombre_usuario;
    usuario.clave = clave;
    usuario.email = email;
    usuario.rol = rol; // Sería el Tipo de Usuario
    usuario.imagen = 'null';
    usuario.fecha_registro = fecha_registro;
    usuario.fecha_ultimo_inicio_sesion = fecha_ultimo_inicio_sesion;

    try {

        if( usuario.clave ){

            // Encriptar contraseña y guardar datos
            // const claveHash = new Promise(async (resolve, reject) => {
            //     await bcrypt.hash( usuario.clave, null, null, async function(err:any, hash:any) {
            //         if (err) {
            //             reject(err);
            //         } else {
            //             usuario.clave = hash;
            //             resolve(hash);
            //         }
            //     });
            // });

            // NUEVA: Otra forma de encriptación
            usuario.clave = bcryptAdapter.hash( usuario.clave );


            // Validaciones previas al guardado final del usuario/persona
            // 1) Vemos que no exista otro usuario registrado con ese email
            const usuarioExistente = await UsuarioModel.findOne({ email: usuario.email });

            // En teoría esto no haría falta xq en la linea 81 aprox tenemos el "RegistroUsuarioDto.create" que valida eso.
            if( usuario.nombre_usuario != null && usuario.email != null ){
                if(!usuarioExistente){

                    // Opcion 2 - GUARDAR USUARIO
                    const usuarioGuardado = await usuario.save();

                    if(usuarioGuardado){
                        console.log({ usuario: usuarioGuardado, success: true, message: 'Solicitud exitosa. Usuario guardado' });
                        // res.status(200).send({ usuario: usuarioGuardado });
                        return usuarioGuardado;
                    }else{
                        console.log({ success: false, message: 'Error al guardar el usuario' });
                        throw ErrorPersonalizado.badRequest('Error al guardar el usuario (del metodo save)');
                        // throw new Error( 'Error al guardar el usuario (del metodo save)' );
                        // res.status(500).send({ message: 'Error al guardar el usuario'}); //.end()
                    }

                }else{
                    throw ErrorPersonalizado.badRequest('Ya existe un usuario registrado con ese email');
                    // throw new Error( 'Ya existe un usuario registrado con ese email' );
                }
            }else{
                throw ErrorPersonalizado.badRequest('Complete todos los campos');
                //throw new Error( 'Complete todos los campos' );
            }
        }else{
            throw ErrorPersonalizado.badRequest('Por favor, introduzca la contraseña');
            // throw new Error('¡¡Introduce la contraseña!!'); // Lanzar un error controlado
        }

    } catch (error) {
        throw error; // Volver a lanzar el error para que sea capturado en el bloque catch de guardarPersona
    }

}

async function loguearUsuario( req:any, res:any ){

    var params = req.body; // Con bodyParser convierte los objetos a JSON

    var email = params.email;
    var clave = params.clave;

    try {

        // NUEVO: Validacion de los campos del lado del back.
        const [error, loginUsuarioDto] = LoginUsuarioDto.create( { clave, email} );
        if ( error ) throw ErrorPersonalizado.badRequest( error );    //return  res.status(400).json( {error} );

        // Buscamos el usuario por medio del mail
        let usuarioEncontrado = await UsuarioModel.findOne( { email: loginUsuarioDto?.email.toLowerCase() } );
        console.log({user: usuarioEncontrado});

        if( !usuarioEncontrado )
            throw ErrorPersonalizado.badRequest('Usuario y/o Contraseña incorrectos.');

        if (usuarioEncontrado.clave !== null && usuarioEncontrado.clave !== undefined) {

            // Convertimos el tipo String de JS a string primitivo para usar el "compare"
            const claveString = typeof usuarioEncontrado.clave === 'string' ? usuarioEncontrado.clave : usuarioEncontrado.clave.toString();

            // Hacemos la comparación de claves para ver si coinciden
            const isMatching = bcryptAdapter.compare(clave, claveString);
            if( !isMatching ) throw ErrorPersonalizado.notFound("La contraseña no es válida");

            // Vemos si se envío el parametro getHash() para devolver el token generado o no, según corresponda.
            if( params.gethash ){
                // Generamos un token de JWT con el usuario logueado, para usarlo en TODO el sistema
                res.status(200).send({
                    token: jwt.createToken( usuarioEncontrado ),
                    usuarioEncontrado
                })
            }else{
                // Enviamos el usuario logueado
                res.status(200).send( usuarioEncontrado );
            }

        } else {
            throw ErrorPersonalizado.notFound("La clave del usuario no está definida");
        }


        // Comprobar la contraseña
        // bcrypt.compare( loginUsuarioDto?.clave, usuarioEncontrado.clave, function( err:any, check:any ) {
        //     if( check ){
        //         // Devolver los datos del usuario logueado
        //         if( params.gethash ){
        //             // Generamos un token de JWT con el usuario logueado, para usarlo en TODO el sistema
        //             res.status(200).send({
        //                 // token: jwt.createToken( usuarioEncontrado[0] )
        //                 token: jwt.createToken( usuarioEncontrado )
        //             })

        //             // res.status(200).send({
        //             //     token: jwt.createToken( usuarioEncontrado )
        //             // });

        //         }else{
        //             res.status(200).send( usuarioEncontrado ); // No hace falta { user: user }. Ya se llama "user"
        //         }
        //     }else{
        //         // Cuando el password desencriptado no coincide
        //         throw ErrorPersonalizado.notFound('No se ha podido identificar el usuario. Clave Incorrecta');
        //         // res.status(404).send({ message: 'No se ha podido identificar el usuario. Clave Incorrecta' });
        //     }
        // });


    } catch (error: any) {
        return res.status(500).send({ error: error, message: error.message });
    }
}

async function actualizarUsuario( req:any, res:any ){


    var userId = req.params.id; // de la URL viene

    // var personaId = req.params.persona;
    var update = req.body;

    // Validamos que por el Body llegue algún campo a actualizar
    if( !update ) return res.status(404).json( { error: "Se requiere ingresar algun campo para actualizar" });

    if( userId != req.usuario.sub ){
        return res.status(500).send({ message: 'No tienes permisos para actualizar este usuario' });
    }

    try {
        // Actualizamos el "usuario"
        const usuarioEncontrado = await UsuarioModel.findByIdAndUpdate( userId, update );
        // Podemos poner en el metodo findByIdAndUpdate ( {new: true}) lo que devolveria el usuario actualizado tambien. Pero perdemos el usuarioAnterior
        const usuarioActualizado = update;

        if( usuarioEncontrado ){

            var personaId = update.persona._id;
            update = req.body.persona;

            // Actualizamos ahora la "persona"
            const personaEncontrada = await PersonaModel.findByIdAndUpdate( personaId, update )
            const personaActualizada = update;


            if ( personaEncontrada ){
                return res.status(200).send({ user: usuarioActualizado, persona: personaActualizada });
            }

        }else{
            res.status(404).send({ message: 'No se ha podido encontrar y actualizar el usuario'});
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al actualzar el usuario. Error: ' + error });
    }
}

async function actualizarImagen( req:any, res:any ){
    var idUsuario = req.idUsuario;

    var file_ext_split = req.imagen.split('\.');
    var file_ext = file_ext_split[file_ext_split.length - 1];

    if( req.imagen && req.imagen != '' && req.idUsuario ){
        if( file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif' ){

            try {
                const imagenActualizada = UsuarioModel.findByIdAndUpdate(
                    idUsuario,
                    { $set: { imagen: req.imagen.toString() } },
                    { new: true }
                )

                // Devolvemos el resultado
                return imagenActualizada;

            } catch (error) {
                console.log({error: error});
                throw ErrorPersonalizado.internalServer("Error al buscar el usuario.");
                //return res.status(500).send({ message: 'Error al buscar el usuario' + error });
            }
        }else{
            throw ErrorPersonalizado.notFound("Extensión del archivo no valida");
            //return res.status(200).send({ message: 'Extensión del archivo no valida' });
        };

    }else{
        throw ErrorPersonalizado.notFound("La imagen no ha sido subida");
        //return res.status(200).send({ message: 'La imagen no ha sido subida' });
    }







    // if( req.files ){
    //     var file_path = req.files.imagen.path; // Ej.: upload\users\C1K_GEcvY93cdFw-PvB_7kwi.jpg

    //     var file_split = file_path.split('\\'); // Devuelve un arrat, usando la Barra(\) como separacion
    //     //VER?
    //     var file_name: string = file_split[2];

    //     var file_ext_split = file_name.split('\.');
    //     var file_ext = file_ext_split[1];

    //     // console.log(file_ext);

    //     if( file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif' ){

    //         try {

    //             UsuarioModel.findByIdAndUpdate(
    //                 userId,
    //                 { $set: { imagen: file_name.toString() } },
    //                 { new: true }
    //             )
    //             .then((updatedUser: any) => {
    //                 return res.status(200).send({ imagen: file_name, user: updatedUser, message: 'Imagen del usuario actualizada correctamente,' });
    //             })
    //             .catch((error: any) => {
    //                 return res.status(500).send({ message: 'Error al actualizar la imagen del usuario' + error });
    //             });

    //         } catch (error) {
    //             return res.status(500).send({ message: 'Error al buscar el usuario' + error });
    //         }
    //     }else{
    //         return res.status(200).send({ message: 'Extensión del archivo no valida' });
    //     };

    // }else{
    //     return res.status(200).send({ message: 'La imagen no ha sido subida' });
    // }
}

async function obtenerAvataUsuario(req: express.Request, res: express.Response): Promise<string|any>{
    try {
        // OPCION 2:
        const usuarioImagen =   await UsuarioModel.findById(req.params.idUsuario).select('imagen').exec();
        if( !usuarioImagen ) throw ErrorPersonalizado.notFound("Error al obtener la imagen del usuario.");

        if( usuarioImagen.imagen === 'null' || usuarioImagen.imagen === null || usuarioImagen.imagen === ''){
            usuarioImagen.imagen = 'https://res.cloudinary.com/frlv73/image/upload/v1737894126/pznyvwuw1cpwcwls5j5z.jpg';
        }

        res.status(200).json({ imagen: usuarioImagen.imagen });  // Devuelve la imagen al cliente

    } catch (error) {
        throw ErrorPersonalizado.badRequest('Error al obtener el avatar del usuario. Error: ' + error);
        // return res.status(500).send({ message: 'Error al obtener el avatar del usuario. Error: ' + error });
    }
}

function obtenerArchivoImagen(req:any, res:any){

    var imageFile = req.params.archivoImagen;

    var path_file = './subidas/usuarios/' + imageFile;

    var existeImagen = fs.existsSync(path_file);
    if( existeImagen ){
        res.sendFile( path.resolve(path_file) );
    }else{
        return res.status(200).send({ message: 'Imagen no encontrada o inexistente' });
    }

}

async function olvideMiPassword(req: express.Request, res: express.Response ){

    const { email } = req.body;

    try {

        const user = await UsuarioModel.findOne({ email });

        if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Generamos un token único
        const token = jwt.createToken( user ); //crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 3600000; // Token válido por 1 hora

        // Guardar el token en el usuario
        user.reseteo_password_token = token;
        user.reseteo_password_expira = tokenExpiration;
        if( user.clave ){
            user.clave = bcryptAdapter.hash( user.clave.toString() );
        }

        // Guardamos el USUARIO
        const usuarioGuardado = await user.save();

        console.log({ usuarioGuardado: usuarioGuardado });

        // Configurar y enviar el correo
        const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'proyectofinalisiutn@gmail.com',
            pass: 'oeol rfgw hzbw axdq' // Contraseña de aplicación generada por gmail
        }
        });

        const mailOptions = {
            from: 'proyectofinalisiutn@gmail.com',
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Hola, como estás? :) \n\nHaz clic en el siguiente enlace para recuperar tu contraseña: \nhttp://localhost:4200/reset-password?token=${token}\n\nSi no solicitaste este cambio, ignora este correo.`
        };

        // Enviamos el mail
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Correo enviado con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la solicitud.', error: err });
    }


}

async function resetPassword(req: express.Request, res: express.Response ){

    const { token, nuevaClave } = req.body;

    try {
      const user = await UsuarioModel.findOne({
        reseteo_password_token: token,
        reseteo_password_expira: { $gt: Date.now() } // Asegurar que el token no haya expirado
      });

      if (!user) {
        return res.status(400).json({ message: 'Token inválido o expirado.' });
      }

      // Actualizar la contraseña
      user.clave = bcryptAdapter.hash(nuevaClave);
      user.reseteo_password_token = null;
      user.reseteo_password_expira = null;
      await user.save();

      res.json({ message: 'Contraseña actualizada con éxito.' });
    } catch (err) {
      res.status(500).json({ message: 'Error al procesar la solicitud.', error: err });
    }
  };

async function eliminarUsuario( req: Request, res: Response )
{
    try {
        var idUsuarioAEliminar = req.params.id;

        // Marcar un usuario como eliminado
        const usuarioAEliminar = await UsuarioModel.findById(idUsuarioAEliminar);
        if (usuarioAEliminar) {
            usuarioAEliminar.baja = true;
            usuarioAEliminar.fecha_baja = moment().toDate();
            await usuarioAEliminar.save();

            return res.status(200).send({ message: `El usuario ${usuarioAEliminar.nombre_usuario} fue dado de baja.`});

            // TODO:

        }else{
            return res.status(404).send({ message: 'No se ha podido localizar el usuario a eliminar'});
        }

        // ES AL PEDO ESTA PARTE!!!
        // const usuario = await Usuario.findById( userId );
        // console.log( usuario );

        // if(usuario == null){
        //     return res.status(404).send({ message: 'No se ha podido localizar el usuario a eliminar'});
        // }

        // const imagenEliminada = await imagen.deleteMany({ _userId: { $in: usuario.imagen } });
        // const usuarioEliminado = await UsuarioModel.findByIdAndRemove( userId );

        // // console.log({ usuarioEliminado });

        // if( usuarioEliminado == null ){
        //     return res.status(404).send({ message: 'No se ha podido eliminar el usuario'});
        // }

        // return res.status(200).send({ user: usuarioEliminado, message: 'Usuario eliminado correctamente!!' });

        // res.redirect('/getCars')

    } catch (error) {
        return res.status(500).send({ message: 'Error al eliminar el usuario' });
    }
}

async function obtenerUsuarios( req:any, res:any ){
    var paginacion = 0;
    if(req.params.paginacion){
        paginacion = req.params.paginacion
    }else{
        paginacion = 1
    }

    paginacion = req.params.paginacion;
    var itemsPorPagina = 5;
    var params = req.body; // Con bodyParser convierte los objetos a JSON

    try {

        // const usuariosEncontrados = await Usuario.find().sort('nombre_usuario').paginate(paginacion, itemsPorPagina);
        const usuariosEncontrados = await UsuarioModel.find().sort('nombre_usuario');

        //console.log( usuariosEncontrados );

        if( usuariosEncontrados.length == 0 ){
            res.status(404).send({ message: 'No hay usuarios registrados' });
        }else{
            return res.status(200).send({ users: usuariosEncontrados, message: 'Usuarios encontrados' });
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener usuarios' + error });
    }
}

async function obtenerUsuarioPorId( req: Request, res: Response ): Promise<IUsuario|any>{

    var userId = req.params.id; // de la URL viene
    var update = req.body;

    try {

        // Asegúrate de que userId sea una cadena de 24 caracteres hexadecimales. Porque sin mandamos "1" por ejemplo explota
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            // Maneja el caso en el que userId no tiene el formato correcto
            throw new Error( 'El "UserId" no posee el formato correcto (ObjectId) para su búsqueda' );
        }

        // Lo convertidos a tupo ObjectId para respetar el tipo de dato en el Model.
        const userIdObject = new mongoose.Types.ObjectId(userId);

        //const usuarioEncontrado2 = await UsuarioModel.find({ "_id": userIdObject });
        const usuarioEncontrado = await UsuarioModel.findById( userIdObject );

        if ( !usuarioEncontrado ) throw ErrorPersonalizado.notFound('Usuario no existe');

        return usuarioEncontrado as IUsuario;
        // return res.status(200).send({ user: usuarioEncontrado, message: 'Usuario encontrado' });

    } catch (error: any) {
        throw ErrorPersonalizado.badRequest('Error al obtener el usuario. Error: ' + error.message)
        //return res.status(500).send({ message: 'Error al obtener el usuario', error: error.message });
    }
}

async function obtenerUsuarioPorNombreUsuario( req: Request, res: Response ){

    var nombreUsuario = req.params.nombreUsuario; // de la URL viene

    try {

        // Asegúrate de que userId sea una cadena de 24 caracteres hexadecimales. Porque sin mandamos "1" por ejemplo explota
        if ( !nombreUsuario ) {
            // Maneja el caso en el que userId no tiene el formato correcto
            throw new Error( 'No ingresó un nombre de usuario' );
        }

        // La "i" hace que sea insensible a mayúsculas y minúsculas. $regex es un operador de mongoose
        const usuarioEncontrado = await UsuarioModel.find({
            nombre_usuario: { $regex: new RegExp(nombreUsuario, 'i') }
        });
        // const usuarioEncontrado = await UsuarioModel.find({ nombre_usuario: nombreUsuario });

        if( !usuarioEncontrado || usuarioEncontrado.length === 0 ){
            return res.status(404).send({ users: [], message: 'Usuario no existe' });
        }

        return res.status(200).send({ users: usuarioEncontrado, message: 'Usuario/s encontrado/s' });

    } catch (error: any) {
        return res.status(500).send({ message: 'Error al obtener el/los usuario/s', error: error.message });
    }
}

module.exports = {
    pruebasControlador,
    guardarUsuario,
    loguearUsuario,
    actualizarUsuario,
    actualizarImagen,
    obtenerArchivoImagen,
    eliminarUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorNombreUsuario,
    obtenerAvataUsuario,
    olvideMiPassword,
    resetPassword,
};