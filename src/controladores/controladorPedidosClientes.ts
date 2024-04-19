import { ItemPedido, PedidoModel } from './../modelos/pedido'
import express from 'express'
import { UsuarioModel } from '../modelos/usuario'
import { ProductoModel } from '../modelos/producto'
import { isValidObjectId } from 'mongoose'

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
  const { productos } = req.body
  const { idCliente } = req.params

  const usuario = await UsuarioModel.findById(idCliente)

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
