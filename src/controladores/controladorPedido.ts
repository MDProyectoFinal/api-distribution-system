import { ItemPedido, PedidoModel } from './../modelos/pedido'
import express from 'express'
import { UsuarioModel } from '../modelos/usuario'
import { ProductoModel } from '../modelos/producto'
import mongoose, { isValidObjectId } from 'mongoose'
import { ErrorPersonalizado } from '../dominio'

export const recuperarTodos = async (req: express.Request, res: express.Response) => {
  const pedidos = await PedidoModel.find()
    .populate('cliente', 'nombre_usuario') // Obtiene solo nombre de usuario.
    // .populate('cliente', 'nombre_usuario email') Ej.: para traer otros campos
    .populate('items.idProducto', 'descripcion imagen') // Obtiene solo la descripción del producto

  return res.status(200).json(pedidos)
}

export const recuperarPorId = async (req: express.Request, res: express.Response) => {
  const { idPedido } = req.params
  console.log(idPedido)
  const pedido = await PedidoModel.findById(idPedido)

  if (!pedido) {
    return res.status(404).json('El pedido no existe')
  }

  return res.status(200).json(pedido)
}

export const recuperarPorFiltros = async (req: express.Request, res: express.Response) => {
  const { idPedido, estado, fechaDesde, fechaHasta, cliente } = req.body
  console.log(idPedido, estado, fechaDesde, fechaHasta, cliente)

  // Define filtro como un objeto que puede tener cualquier propiedad
  const filtro: { [key: string]: any } = {}

  // Agregamos filtros solo si están definidos
  if (idPedido) filtro.idPedido = idPedido // Asumiendo que este es un campo en tu modelo
  if (cliente) filtro.cliente = cliente // ObjectId del cliente
  if (estado) filtro.estado = { $regex: new RegExp(estado, 'i') }; // Estado del pedido
  if (fechaDesde || fechaHasta) {
    // Creamos el filtro para fechas, usando fechaDesde y fechaHasta
    filtro.fechaAlta = {} // En mi modelo, se llama "fechaAlta".
    if (fechaDesde) {
      filtro.fechaAlta.$gte = new Date(fechaDesde) // Mayor o igual a fechaDesde
    }
    if (fechaHasta) {
      filtro.fechaAlta.$lte = new Date(fechaHasta) // Menor o igual a fechaHasta
    }
  }

  try {
    const pedidos = await PedidoModel.find(filtro)
      .populate('cliente', 'nombre_usuario') // Obtiene solo nombre de usuario.
      .populate('items.idProducto', 'descripcion imagen') // Obtiene solo la descripción del producto

    return res.status(200).json(pedidos)
  } catch (error) {
    return ErrorPersonalizado.notFound('Error al tratar de obtener los pedidos')
  }
}

export const insertarPedido = async (req: express.Request, res: express.Response) => {
  const { idUsuario, productos } = req.body

  const usuario = await UsuarioModel.findById(idUsuario)

  if (!usuario) {
    return res.sendStatus(404).send('El cliente no existe')
  }


  const pedidoSinPago = await PedidoModel.findOne({
    pagado: false,
    cliente: new mongoose.Types.ObjectId(idUsuario)
  });

  if(pedidoSinPago){
    return res.status(400).send(`Ya tiene registrado un pedido pendiente de pago (nro: ${pedidoSinPago.idPedido})`)
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

    const fechaActual = new Date()
    const promocionActiva = productoEncontrado.promociones.find((promocion) => {
      return promocion.activa && promocion.fecha_inicio <= fechaActual && (promocion.fecha_fin === null || promocion.fecha_fin >= fechaActual)
    })

    let precioAplicado = promocionActiva ? promocionActiva.precio : productoEncontrado.precio_unitario

    nuevoPedido.items.push({
      idProducto: productoEncontrado._id,
      cantidad: productoProcesado.cantidad,
      precioPromocional: promocionActiva?.precio,
      precioUnitario: productoEncontrado.precio_unitario,
      precio: precioAplicado,
      total: productoProcesado.cantidad * precioAplicado,
    })

    productoEncontrado.stock -= productoProcesado.cantidad

    if (productoEncontrado.stock < 0) {
      return res.status(400).send(`El producto ${productoProcesado.idProducto} no tiene suficiente stock.`)
    }

    productoEncontrado.save()
  }

  nuevoPedido.items.map((i: ItemPedido) => i.total).forEach((valor: number) => (nuevoPedido.subtotal += valor))
  await nuevoPedido.save()
  return res.status(201).json(nuevoPedido.toObject())
}

export const eliminarPorId = async (req: express.Request, res: express.Response) => {}

export const cambiarEstadoPorIdPedido = async (req: express.Request, res: express.Response) => {
  try {
    const { idPedido } = req.params // ID personalizado del pedido
    const { estadoNuevo } = req.body // Estado nuevo a actualizar

    const pedidoActualizado = await PedidoModel.findOneAndUpdate(
      { idPedido }, // Condición de búsqueda
      { estado: estadoNuevo.toUpperCase() }, // Campo a actualizar
      { new: true } // Retorna el documento actualizado
    )

    if (!pedidoActualizado) return ErrorPersonalizado.notFound('No se encontró un pedido al cual cambiarle el estado.')

    return res.status(200).send({ pedidoActualizado: pedidoActualizado })
  } catch (error) {
    return ErrorPersonalizado.badRequest('Error al cambiar el estado del pedido.')
  }
}

export const actualizacionCompleta = async (req: express.Request, res: express.Response) => {}

export const actualizacionParcial = async (req: express.Request, res: express.Response) => {}
