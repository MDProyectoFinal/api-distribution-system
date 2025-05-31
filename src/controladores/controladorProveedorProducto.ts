import { ErrorPersonalizado } from "../dominio/errors/error.personalizado";
import express from 'express';
import { ProductoModel } from "../modelos/producto";
import { ProductoConPromocionDTO } from "dominio/dtos/productos/producto-promocion";
import { TipoProductoModel } from "../modelos/tipoProducto";
import { ProveedorProductoModel } from "../modelos/proveedorProducto";
import mongoose from "mongoose";

export const recuperarPorIdProveedor = async (req: express.Request, res: express.Response) => {
    
  const idProveedor = req.params.idProveedor || req.query.idProveedor;

  if (!idProveedor) {
    return res.status(400).json({ mensaje: 'Falta el parámetro idProveedor' });
  }
  

  // Define filtro como un objeto que puede tener cualquier propiedad 
  const filtro: { [key: string]: any } = {}

  // Agregamos filtros solo si están definidos
  if (idProveedor) filtro.proveedor_id = new mongoose.Types.ObjectId(idProveedor.toString());
  
  try {
    const productosProveedor = await ProveedorProductoModel.find(filtro)
      .populate('proveedor_id', 'razon_social cuit') // Obtiene solo nombre de usuario.  
      .populate('producto_id', 'nombre descripcion')    

    if( productosProveedor.length === 0){
      return res.status(200).json({ productos: [], mensaje: "No se encontraron productos..." });
    }
    
    return res.status(200).json({ productos: productosProveedor })
  } catch (error) {
    return ErrorPersonalizado.notFound('Error al tratar de obtener los productos del proveedor')
  }
}

export const recuperarPorId = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const producto = await ProductoModel.findById(id)

    if (!producto) {
      return res.status(404)
    }

    const fechaActual = new Date()
    const promocionActiva = producto.promociones.find((promocion) => {
      return promocion.activa && promocion.fecha_inicio <= fechaActual && (promocion.fecha_fin === null || promocion.fecha_fin >= fechaActual)
    })

    const productoDTO: ProductoConPromocionDTO = {
      _id: producto._id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      precio_unitario: producto.precio_unitario,
      stock: producto.stock,
      destacado: producto.destacado,
      tipoProducto: producto.tipoProducto,
      promocionActiva,
    }


    return res.send(productoDTO)
  } catch (error) {
    console.error(error)

    return res.sendStatus(500)
  }
}

async function buscarIdsTiposProductos(tipo: string) {
  if (tipo === 'todos') {
    return await TipoProductoModel.find().select('_id')
  }

  return await TipoProductoModel.where('descripcion').in(tipo.split(',')).select('_id')
}

module.exports = {
    recuperarPorId,
    buscarIdsTiposProductos,
    recuperarPorIdProveedor
};
