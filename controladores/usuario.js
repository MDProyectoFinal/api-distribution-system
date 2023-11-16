'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelos/usuario');
var Persona = require('../modelos/persona');

var jwt = require('../servicios/jwt');

const usuario = require('../modelos/usuario');
const { debug } = require('console');

async function pruebasControlador( req, res ){

    console.log(res);

    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del api rest con Node y MongoDB'
    });
}

async function guardarUsuario( req, res ){
    
    var usuario = new Usuario();
    var [persona = null, nombre_usuario = null, clave = null, email = null, rol = null, imagen = null, fecha_registro = null, fecha_ultimo_inicio_sesion = null ] = [null, null, null, null, null, null, null, null];
    
    debugger;

    // Vemos si viene por el body (metodo directo) o si viene desde el "Guardar Persona"
    if (typeof req.body === 'undefined' || req.body === '') {
        // Si viene desde el método GuardarPersona
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
        persona = req.body.persona;
        nombre_usuario = req.body.nombre_usuario;
        clave = req.body.clave;
        email = req.body.email;
        rol = req.body.rol;

        const fechaActual = new Date();
        fecha_registro = fechaActual;
        fecha_ultimo_inicio_sesion = fechaActual;
    }

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
            const claveHash = new Promise(async (resolve, reject) => {
                await bcrypt.hash( usuario.clave, null, null, async function(err, hash) {
                    if (err) {                        
                        reject(err);
                    } else {
                        usuario.clave = hash;
                        resolve(hash);
                    }
                });
            });
                        
            // Validaciones previas al guardado final del usuario/persona
            // 1) Vemos que no exista otro usuario registrado con ese email
            const usuarioExistente = await Usuario.findOne({ email: usuario.email });            
            
            if( usuario.nombre_usuario != null && usuario.email != null ){
                if(!usuarioExistente){
                                        
                    // Opcion 2 - GUARDAR USUARIO
                    const usuarioGuardado = await usuario.save();

                    if(usuarioGuardado){
                        console.log({ usuario: usuarioGuardado, success: true, message: 'Solicitud exitosa. Usuario guardado' });
                        // res.status(200).send({ usuario: usuarioGuardado });
                        return usuarioGuardado;
                    }else{
                        console.log({ errorGuardado: error, success: false, message: 'Error al guardar el usuario' }); 
                        throw new Error( 'Error al guardar el usuario (del metodo save)' );                                             
                        // res.status(500).send({ message: 'Error al guardar el usuario'}); //.end()
                    }

                }else{                    
                    throw new Error( 'Ya existe un usuario registrado con ese email' );                    
                } 
            }else{                
                throw new Error( 'Complete todos los campos' );                
            }                        
        }else{     
            throw new Error('¡¡Introduce la contraseña!!'); // Lanzar un error controlado            
        }

    } catch (error) {        
        throw error; // Volver a lanzar el error para que sea capturado en el bloque catch de guardarPersona
    }

}

async function loguearUsuario( req, res ){
    
    var params = req.body; // Con bodyParser convierte los objetos a JSON

    var email = params.email;
    var clave = params.clave;

    try {
        //const usuarioEncontrado = new Usuario();
        let usuarioEncontrado = await Usuario.find( { email: email.toLowerCase() } );
        
        console.log({user: usuarioEncontrado[0]});

        if( usuarioEncontrado.length == 0 ){            
            res.status(404).send({ message: 'Usuario no existe' });
        }else{
            // Comprobar la contraseña
            bcrypt.compare( clave, usuarioEncontrado[0].clave, function( err, check ) {
                if( check ){
                    // Devolver los datos del usuario logueado                        
                    if( params.gethash ){
                        // Generamos un token de JWT con el usuario logueado, para usarlo en TODO el sistema
                        res.status(200).send({
                            // token: jwt.createToken( usuarioEncontrado[0] )
                            token: jwt.createToken( usuarioEncontrado[0] )
                        })

                        // res.status(200).send({ 
                        //     token: jwt.createToken( usuarioEncontrado )
                        // });
    
                    }else{                    
                        res.status(200).send( usuarioEncontrado[0] ); // No hace falta { user: user }. Ya se llama "user"
                    }
                }else{
                    // Cuando el password desencriptado no coincide
                    res.status(404).send({ message: 'No se ha podido identificar el usuario. Clave Incorrecta' });
                }
            });
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al loguear el usuario' });
    }
}

async function actualizarUsuario( req, res ){
    
    var userId = req.params.id; // de la URL viene
    // var personaId = req.params.persona;
    var update = req.body;


    if( userId != req.usuario.sub ){
        return res.status(500).send({ message: 'No tienes permisos para actualizar este usuario' });
    }

    try {
        
        // Actualizamos el "usuario"
        const usuarioEncontrado = await Usuario.findByIdAndUpdate( userId, update );    
        const usuarioActualizado = update;

        if( usuarioEncontrado ){
            
            var personaId = update.persona._id;            
            update = req.body.persona;

            // Actualizamos ahora la "persona"
            const personaEncontrada = await Persona.findByIdAndUpdate( personaId, update )
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

function actualizarImagen( req, res ){
    var userId = req.params.id;
    var file_name = 'No subido...';
    
    if( req.files ){
        var file_path = req.files.imagen.path; // Ej.: upload\users\C1K_GEcvY93cdFw-PvB_7kwi.jpg
        
        var file_split = file_path.split('\\'); // Devuelve un arrat, usando la Barra(\) como separacion
        var file_name = file_split[2];
        
        var file_ext_split = file_name.split('\.');
        var file_ext = file_ext_split[1];

        console.log(file_ext);
        
        if( file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif' ){
            
            try {

                Usuario.findByIdAndUpdate(
                    userId,
                    { $set: { imagen: file_name.toString() } },
                    { new: true }
                )
                .then((updatedUser) => {
                    return res.status(200).send({ imagen: file_name, user: updatedUser, message: 'Imagen del usuario actualizada correctamente,' }); 
                })
                .catch((error) => {
                    return res.status(500).send({ message: 'Error al actualizar la imagen del usuario' + error });
                });

            } catch (error) {
                return res.status(500).send({ message: 'Error al buscar el usuario' + error });
            }
        }else{
            return res.status(200).send({ message: 'Extensión del archivo no valida' });
        };

    }else{
        return res.status(200).send({ message: 'La imagen no ha sido subida' });
    } 
}


function obtenerArchivoImagen(req, res){
    var imageFile = req.params.archivoImagen;

    var path_file = './subidas/usuarios/' + imageFile;

    var existeImagen = fs.existsSync(path_file);    
    if( existeImagen ){
        res.sendFile( path.resolve(path_file) );
    }else{
        return res.status(200).send({ message: 'Imagen no encontrada o inexistente' });
    }

}

async function eliminarUsuario( req, res )
{
    try {
        var userId = req.params.id;

        // ES AL PEDO ESTA PARTE!!!
        // const usuario = await Usuario.findById( userId );
        // console.log( usuario );

        // if(usuario == null){
        //     return res.status(404).send({ message: 'No se ha podido localizar el usuario a eliminar'});
        // }

        // const imagenEliminada = await imagen.deleteMany({ _userId: { $in: usuario.imagen } });
        const usuarioEliminado = await Usuario.findByIdAndRemove( userId );    
         
        console.log({ usuarioEliminado });

        if( usuarioEliminado == null ){
            return res.status(404).send({ message: 'No se ha podido eliminar el usuario'});
        }      

        return res.status(200).send({ user: usuarioEliminado, message: 'Usuario eliminado correctamente!!' }); 
        
        // res.redirect('/getCars')

    } catch (error) {
        return res.status(500).send({ message: 'Error al eliminar el usuario' });
    }    
}

async function obtenerUsuarios( req, res ){

    if(req.params.paginacion){
        var paginacion = req.params.paginacion
    }else{
        var paginacion = 1
    }

    var paginacion = req.params.paginacion;
    var itemsPorPagina = 5;
    var params = req.body; // Con bodyParser convierte los objetos a JSON

    try {

        // const usuariosEncontrados = await Usuario.find().sort('nombre_usuario').paginate(paginacion, itemsPorPagina);
        const usuariosEncontrados = await Usuario.find().sort('nombre_usuario');

        console.log( usuariosEncontrados );
        
        if( usuariosEncontrados.length == 0 ){
            res.status(404).send({ message: 'No hay usuarios registrados' });
        }else{
            return res.status(200).send({ users: usuariosEncontrados, message: 'Usuarios encontrados' });
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener usuarios' + error });
    }
}

async function obtenerUsuario( req, res ){

    var userId = req.params.id; // de la URL viene
    var update = req.body;
    console.log(userId);
    try {
        const usuarioEncontrado = await Usuario.find({ "_id": userId });
        console.log( usuarioEncontrado );

        if( usuarioEncontrado.length == 0 ){
            res.status(404).send({ message: 'Usuario no existe' });
        }else{
            return res.status(200).send({ user: usuarioEncontrado, message: 'Usuario encontrado' });
        }

    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener el usuario' });
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
    obtenerUsuario
};