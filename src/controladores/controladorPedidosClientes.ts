import { ItemPedido, PedidoModel } from './../modelos/pedido'
import express from 'express'
import { UsuarioModel } from '../modelos/usuario'
import { ProductoModel } from '../modelos/producto'
import mongoose, { isValidObjectId } from 'mongoose'

export const recuperarTodos = async (req: express.Request, res: express.Response) => {
  const { idCliente } = req.params
  const pedidos = await PedidoModel.find({ cliente: idCliente })
  return res.status(200).json(pedidos)
}

export const recuperarPorId = async (req: express.Request, res: express.Response) => {
  const { idPedido, idCliente } = req.params

  const pedido = await PedidoModel.find({ _id: idPedido, cliente: idCliente })

  if (!pedido) {
    return res.status(404).json('El pedido no existe')
  }

  return res.status(200).json(pedido)
}

export const insertarPedido = async (req: express.Request, res: express.Response) => {
  const { productos, pedidoPagado } = req.body
  const {idCliente} = req.params

  const usuario = await UsuarioModel.findById(idCliente)

  if (!usuario) {

    return res.sendStatus(404).send('El cliente no existe')
  }

  /* Control de existencia de "pedido pendiente de pago" para usuario actual */
  const pedidoSinPagoExistente = await PedidoModel.findOne({
      pagado: false,
      cliente: new mongoose.Types.ObjectId(idCliente)
  });

  if(pedidoSinPagoExistente && pedidoPagado === false){
    return res.status(400).send(`Ya tiene registrado un pedido pendiente de pago (nro: ${pedidoSinPagoExistente.idPedido})`)
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

    const fechaActual = new Date();
    const promocionActiva = productoEncontrado.promociones.find((promocion) => {
      return (
        promocion.activa &&
        promocion.fecha_inicio <= fechaActual &&
        (promocion.fecha_fin === null || promocion.fecha_fin >= fechaActual)
      );
    });

    let precioAplicado = promocionActiva ? promocionActiva.precio : productoEncontrado.precio_unitario

    nuevoPedido.items.push({
      idProducto: productoEncontrado._id,
      cantidad: productoProcesado.cantidad,
      precioPromocional : promocionActiva?.precio,
      precioUnitario : productoEncontrado.precio_unitario,
      precio: precioAplicado,
      total: productoProcesado.cantidad * precioAplicado,
    })

    productoEncontrado.stock -= productoProcesado.cantidad

    if(productoEncontrado.stock < 0){
      return res.status(400).send(`El producto ${productoProcesado.idProducto} no tiene suficiente stock.`)
    }

    productoEncontrado.save()
  }

  nuevoPedido.items.map((i: ItemPedido) => i.total).forEach((valor: number) => (nuevoPedido.subtotal += valor))
  await nuevoPedido.save()

  return res.status(201).json(nuevoPedido.toObject())
}

export const eliminarPorId = async (req: express.Request, res: express.Response) => {}




