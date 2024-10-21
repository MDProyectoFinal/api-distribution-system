import { ItemPedido, PedidoModel } from './../modelos/pedido'
import express from 'express'
import { UsuarioModel } from '../modelos/usuario'
import { ProductoModel } from '../modelos/producto'
import { isValidObjectId } from 'mongoose'
import { ErrorPersonalizado } from '../dominio'

export const recuperarTodos = async (req: express.Request, res: express.Response) => {

    const pedidos = await PedidoModel.find()
      .populate('cliente', 'nombre_usuario') // Obtiene solo nombre de usuario.
      // .populate('cliente', 'nombre_usuario email') Ej.: para traer otros campos
      .populate('items.idProducto', 'descripcion'); // Obtiene solo la descripción del producto

    return res.status(200).json(pedidos)
}

export const recuperarPorId = async (req: express.Request, res: express.Response) => {

    const { idPedido } = req.params
    console.log(idPedido)
    const pedido = await PedidoModel.findById(idPedido)

    if(!pedido){
        return res.status(404).json("El pedido no existe")
    }

    return res.status(200).json(pedido)
}

export const recuperarPorFiltros = async (req: express.Request, res: express.Response) => {

  const { idPedido, estado, fechaDesde, fechaHasta, cliente } = req.body
  console.log( idPedido, estado, fechaDesde, fechaHasta, cliente );

   // Define filtro como un objeto que puede tener cualquier propiedad
  const filtro: { [key: string]: any } = {};

   // Agregamos filtros solo si están definidos
  if (idPedido) filtro.idPedido = idPedido; // Asumiendo que este es un campo en tu modelo  
  if (cliente) filtro.cliente = cliente; // ObjectId del cliente
  if (estado) filtro.estado = estado; // Estado del pedido 
  if (fechaDesde || fechaHasta) {
    // Creamos el filtro para fechas, usando fechaDesde y fechaHasta
    filtro.fechaAlta = {}; // En mi modelo, se llama "fechaAlta".
    if (fechaDesde) {
      filtro.fechaAlta.$gte = new Date(fechaDesde); // Mayor o igual a fechaDesde
    }
    if (fechaHasta) {
      filtro.fechaAlta.$lte = new Date(fechaHasta); // Menor o igual a fechaHasta
    }
  }

  try{
    const pedidos = await PedidoModel.find(filtro)
    .populate('cliente', 'nombre_usuario') // Obtiene solo nombre de usuario.      
    .populate('items.idProducto', 'descripcion'); // Obtiene solo la descripción del producto

    return res.status(200).json(pedidos);

  }catch( error ){
    return ErrorPersonalizado.notFound("Error al tratar de obtener los pedidos");
  }
}

export const insertarPedido = async (req: express.Request, res: express.Response) => {
  const { idUsuario, productos } = req.body

  const usuario = await UsuarioModel.findById(idUsuario)

  if (!usuario) {
    return res.sendStatus(404).send('El cliente no existe')
  }

  const nuevoPedido = new PedidoModel()
  nuevoPedido.cliente = usuario._id

  for (const productoProcesado of productos) {
    if (!isValidObjectId(productoProcesado.idProducto)) {
      return res.status(400).send(`El id ${productoProcesado.idProducto} no es válido.`)
    }

    const productoEncontrado = await ProductoModel.findById(productoProcesado.idProducto)

    if (!productoEncontrado) {
      return res.status(404).send(`El producto con id ${productoProcesado.idProducto} no existe`)
    }

    nuevoPedido.items.push({
      idProducto: productoProcesado.idProducto,
      cantidad: productoProcesado.cantidad,
      precio: productoEncontrado.precio_unitario,
      total: productoProcesado.cantidad * productoEncontrado.precio_unitario,
    })
  }

  nuevoPedido.items.map((i: ItemPedido) => i.total).forEach((valor: number) => (nuevoPedido.subtotal += valor))
  nuevoPedido.estado = 'INICIADO'
  nuevoPedido.save()

  return res.status(201).json(nuevoPedido.toObject())
}

export const eliminarPorId = async (req: express.Request, res: express.Response) => {}

export const actualizacionCompleta = async (req: express.Request, res: express.Response) => {}

export const actualizacionParcial = async (req: express.Request, res: express.Response) => {}
