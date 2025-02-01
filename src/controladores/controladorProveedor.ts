import { ErrorPersonalizado } from "../dominio/errors/error.personalizado";
import express from 'express';
import { ProveedorModel } from '../modelos/proveedor';
import mongoose from "mongoose";

import PDFDocument from 'pdfkit';
import { ProductoReporteDTO } from "dominio/dtos/productos/producto-reporte";

export const recuperarTodos = async (req: express.Request, res: express.Response) => {

    try{
        const proveedores = await ProveedorModel.find().sort({ razon_social: 1 });

        if( proveedores.length == 0 ){
            throw ErrorPersonalizado.notFound('No existen proveedores registrados');                                
        }else{
            return res.status(200).send({ proveedores: proveedores, message: 'Proveedores encontrados' });
        }

    }catch(error){
        throw ErrorPersonalizado.badRequest('Error al obtener proveedores: ' + error );
    }  

}

const obtenerFechaActual = () => { 
    const hoy = new Date(); 
    const dia = String(hoy.getDate()).padStart(2, '0'); 
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0 
    const año = hoy.getFullYear(); 
    
    return `${dia}-${mes}-${año}`; 
};

export const generarReporte = async (req: any, res: any) => {
    
    try{    
        const { proveedor, productos } = req.body;
    
        const doc = new PDFDocument({ margin: 50 });
        
        let filename = `pedido_prov_${ obtenerFechaActual() }.pdf`;
        res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');
    
        doc.pipe(res);
    
        // Encabezado        
        doc.image('src/subidas/extras/producto_snack.jpg', 50, 40, { width: 50 }) // Agrega un logo si tienes
           .fontSize(20)
           .text('Pedido al Proveedor', 110, 50, { align: 'left' })
           .moveDown()
           .fontSize(12)
           .text(`Fecha: ${obtenerFechaActual()}`, { align: 'right' });
    
        let y = 100; // Punto inicial para el texto dinámico

        doc.moveDown()
           .fontSize(14)
           .text(`Proveedor: ${proveedor.razon_social}`, 50, y);
        
        y += 30; // Mueve hacia abajo después de cada texto
        doc.moveDown();
        
        // Tabla de productos
        const tableTop = 150;
        const itemHeight = 20;

        doc.moveDown()
            .fontSize(12).text('Lista de Productos', 50, y);
        y += 20; // Espaciado antes de la tabla

        // Encabezados de la tabla
        doc.fontSize(10)
            .text('N°', 50, tableTop)
            .text('Producto', 100, tableTop)
            .text('Descripción', 250, tableTop)
            .text('Cantidad', 450, tableTop, { align: 'right' });
            
        doc.moveDown();

        // Dibujar productos
        y = tableTop + itemHeight;
        productos.forEach(( producto: ProductoReporteDTO, index: any ) => {
            doc.fontSize(10)
                .text(index + 1, 50, y)
                .text(producto.nombre, 100, y)
                .text(producto.descripcion, 250, y)
                .text(producto.cantidad.toString(), 450, y, { align: 'right' });
            y += itemHeight;
        });

        doc.moveDown();

        // Pie de página
        const footerTop = y + 50;
        doc.moveTo(50, footerTop).lineTo(550, footerTop).stroke(); // Línea separadora

        doc.fontSize(10)
        .text(
            '*Recuerde imprimir o enviar por correo este ticket al proveedor correspondiente.',
            50,
            footerTop + 10,
            { align: 'center' }
        );

        doc.end();

    }catch(error: any){        
        console.log("Error al generar reporte: " + error)
        throw "Error al generar el reporte del pedido al proveedor: " + error.message;
    }
};

export const recuperarPorId = async (req: express.Request, res: express.Response) => {

    try {
        const { id } = req.params
        const proveedor = await ProveedorModel.findById(id)
    
        if (!proveedor) {
          return ErrorPersonalizado.notFound("No se encontró el proveedor buscado.");
        }    
          
        return res.send(proveedor)

      } catch (error) {       
        ErrorPersonalizado.badRequest("Error al intentar recuperar el proveedor especificado");    
      }

}

export const obtenerProveedoresPorRazonSocial = async( req: express.Request, res: express.Response ) => {

    var razonSocialProveedor = req.params.razonSocial; // de la URL viene
      
    try {
        
        if ( !razonSocialProveedor ) {
            // Maneja el caso en el que userId no tiene el formato correcto
            throw new Error( 'No ingresó una razón social para el o los proveedores' ); 
        }
             
        // La "i" hace que sea insensible a mayúsculas y minúsculas. $regex es un operador de mongoose
        const proveedorEncontrado = await ProveedorModel.find({ 
            razon_social: { $regex: new RegExp(razonSocialProveedor, 'i') }
        });
        // const usuarioEncontrado = await UsuarioModel.find({ nombre_usuario: nombreUsuario });

        if( !proveedorEncontrado || proveedorEncontrado.length === 0 ){
            return res.status(404).send({ providers: [], message: 'Proveedor no existe' });
        }
            
        return res.status(200).send({ providers: proveedorEncontrado, message: 'Proveedor/es encontrado/s' });        

    } catch (error: any) {
        return res.status(500).send({ message: 'Error al obtener el/los proveedor/es', error: error.message });
    }
}

export const insertarProveedor = async (req: express.Request, res: express.Response) => {

    var proveedor = new ProveedorModel();

    try {
        const { razon_social, cuit, telefono, direccion, email, activo, nota_adicional } = req.body
            
        if (!razon_social) {
          return res.status(400).send({ messageError: 'La RAZÓN SOCIAL no puede estar vacía' });
        }
    
        if (!cuit) {
            return res.status(400).send({ messageError: 'El CUIT no puede estar vacío' });
        }    
    
        if (!telefono) {
            return res.status(400).send({ messageError: 'El TELÉFONO no puede estar vacío.' });
        }

        if (!direccion) {
            return res.status(400).send({ messageError: 'La DIRECCIÓN no puede estar vacía.' });
        }

        if (!email) {
            return res.status(400).send({ messageError: 'El EMAIL no puede estar vacío.' });            return ErrorPersonalizado.badRequest('El EMAIL no puede estar vacío.')
        }
            
        // Mapeamos la instancia con el nuevo proveedor
        proveedor = new ProveedorModel({
            razon_social,
            cuit,
            telefono,
            direccion,
            email,
            nota_adicional: nota_adicional != null && nota_adicional != "" ? nota_adicional : ""            
        })
                
        // Guardamos
        const proveedorInsertado = await proveedor.save();    
        return res.status(200).send({ provInsertado: proveedorInsertado });

    } catch (error) {
        throw error;
        //throw ErrorPersonalizado.badRequest("No se pudo insertar el nuevo proveedor. Reintente.");
    }

}

export const eliminarPorId = async (req: express.Request, res: express.Response) => {

    try {
        const { id } = req.params
        
        const proveedorEliminado = await ProveedorModel.findByIdAndDelete(id)
    
        if (!proveedorEliminado) {
          throw ErrorPersonalizado.notFound("No se encontró el proveedor a eliminar.");
        }
    
        return res.status(200).send({ status: 'Éxito', proveedorEliminado: proveedorEliminado });

      } catch (error) {
        return res.status(500).send({ mensaje: "No se pudo eliminar el proveedor", error: error });
        //throw ErrorPersonalizado.badRequest("Error al querer eliminar el proveedor");
      }

}

export const eliminacionLogica = async (req: express.Request, res: express.Response) => {

    try {
        const { id } = req.params

        // Validamos el ID que llega si es correcto antes de seguir
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID inválido");
        }

        const proveedorExistente = await ProveedorModel.findById( id );
        if (!proveedorExistente) {
            return res.status(200).send("Error: El proveedor no existe en la base de datos.");
        }

        // const personaActualizada = await PersonaModel.findByIdAndUpdate( personaIdObject.toHexString(), update, { new: true } );
        const proveedorActualizado = await ProveedorModel.findByIdAndUpdate( 
            id, //.toHexString(), 
            { activo: false }, // Campo a actualizar 
            { new: true } // Retornar el documento actualizado 
        );             
        if (proveedorActualizado) { 
            return res.status(200).send({ error: null, provActualizado: proveedorActualizado }); 
        } else { 
            return res.status(200).send({ error: "No se ha encontrado el proveedor a actualizar", provActualizado: null });
        }

      } catch (error: any) {
        return res.status(200).send({ error: "Error al querer eliminar el proveedor: " + error?.message, provActualizado: null });
      }

}

export const editarProveedor = async (req: any, res: any) => {

    var proveedorId = req.params.id; // de la URL viene

    // Mandamos todos los datos a editar del proveedor
    var update = req.body;

    // Validamos que por el Body llegue algún campo a actualizar
    if( !update || Object.keys(update).length === 0 ) return ErrorPersonalizado.notFound("Se requiere ingresar algun campo para actualizar");
        
    try {
        
        if (!update.razon_social) throw new Error('La RAZÓN SOCIAL no puede estar vacía');
        if (!update.telefono) throw new Error('El TELÉFONO no puede estar vacío.');
        if (!update.direccion) throw new Error('La DIRECCIÓN no puede estar vacía.');
        if (update.cuit && !/^[0-9]{6,}$/.test(update.cuit)) throw new Error('El CUIT debe tener al menos 6 dígitos y ser un número.');
        if (update.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(update.email)) throw new Error('El EMAIL no tiene un formato válido.');
       
        // Actualizamos el "proveedor"
        const proveedorEncontrado = await ProveedorModel.findByIdAndUpdate( 
            proveedorId, 
            update
            //{ new: true, runValidators: true } // para SOLO devolver el usuario actualizado.
        );            
        const proveedorActualizado = update;

        if( proveedorEncontrado ){            
            return res.status(200).send({ provActualizado: proveedorActualizado, provOriginal: proveedorEncontrado });
        }else{
            return res.status(404).send({ mensaje: "No se ha podido encontrar el proveedor a actualizar" });            
        }
        
    } catch (error) {
        return res.status(500).send({ message: 'Error al actualizar el proveedor. Error: ' + error });
    }

}

module.exports = {
    insertarProveedor,
    editarProveedor,
    eliminacionLogica,
    eliminarPorId,
    recuperarTodos,
    recuperarPorId,
    obtenerProveedoresPorRazonSocial,
    generarReporte
};
