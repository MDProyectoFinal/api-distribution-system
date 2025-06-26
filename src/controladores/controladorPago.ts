import express from 'express'
import axios from 'axios'
import { PedidoModel, ItemPedido } from './../modelos/pedido'
import { ProductoModel } from './../modelos/producto'
import { UsuarioModel } from './../modelos/usuario'
import { isValidObjectId } from 'mongoose'
import { title } from 'process'

// const mercadopago = require('mercadopago');

export const crearPreferenciaPago = async (req: express.Request, res: express.Response) => {
  const { payer_email, items } = req.body

  const url = 'https://api.mercadopago.com/checkout/preferences'

  // Define la preferencia de pago
  const preference = {
    payer_email: payer_email,
    items: items,

    back_urls: {
      success: 'https://localhost:4200/client/pago-success',
      failure: 'http://localhost:4200/client/pago-failure',
      pending: 'http://localhost:4200/client/pago-pending',
    },
    auto_return: 'approved', // Redirección automática al aprobar el pago
  }

  // Configurar los headers (incluye tu Access Token de Mercado Pago)
  // TODO: Ver si usamos el "process.env.MP_ACCESS_TOKEN" o el "Headers" recibido del FRONT
  const headers = {
    'Content-Type': req.headers['content-type'], // 'application/json',
    Authorization: req.headers.authorization, // `Bearer ${process.env.MP_ACCESS_TOKEN}`, // Access Token
  }

  try {
    // NUEVO: Realizar la solicitud POST a la API de Mercado Pago
    const response = await axios.post(url, preference, { headers })

    // Enviar la respuesta con el ID de preferencia y otros datos útiles
    res.status(200).json({
      data: response.data,
      // id: response.data.id,
      // init_point: response.data.init_point, // URL para redirigir al checkout
      // sandbox_init_point: response.data.sandbox_init_point, // URL de prueba
    })
  } catch (error: any) {
    console.error('Error al crear preferencia:', error.response?.data || error.message)
    res.status(500).json({
      error: error.response?.data || 'No se pudo crear la preferencia de pago',
    })
  }
}

export const pagarPedidoExistenteConMP = async (req: express.Request, res: express.Response) => {
  const { payer_email } = req.body
  const idPedido = req.params.idPedido

  const pedido = await PedidoModel.findById(idPedido)

  if (!pedido) {
    return res.status(404).send('El pedido no existe')
  }

  const items = []
  for (let i = 0; i < pedido.items.length; i++) {
    const element = pedido.items[i]
    const prod = await ProductoModel.findById(element.idProducto)
    items.push({
      id: element.idProducto,
      title: prod?.nombre,
      picture_url: prod?.imagen,
      category_id: prod?.tipoProducto,
      description: prod?.descripcion,
      currency_id: 'ARS',
      unit_price: element.precio,
      quantity: element.cantidad
    })
  }

  const url = 'https://api.mercadopago.com/checkout/preferences'

  // Define la preferencia de pago
  const preference = {
      payer_email: payer_email,
      payer: {
		email: payer_email
	},
      items: items,

      back_urls: {
        success: `https://localhost:4200/client/pago-success/?pid=${idPedido}`,
        failure: `http://localhost:4200/client/pago-failure/?pid=${idPedido}`,
        pending: `http://localhost:4200/client/pago-pending/?pid=${idPedido}`,
      },
      auto_return: 'approved',
    }

    // Configurar los headers (incluye tu Access Token de Mercado Pago)
    // TODO: Ver si usamos el "process.env.MP_ACCESS_TOKEN" o el "Headers" recibido del FRONT
    const headers = {
      'Content-Type': 'application/json', // 'application/json',
      Authorization: 'Bearer APP_USR-3595488656828811-112515-31c2962634f5c18f330f4bb8ead67d88-2116426284', // `Bearer ${process.env.MP_ACCESS_TOKEN}`, // Access Token
    }

    try {
      // NUEVO: Realizar la solicitud POST a la API de Mercado Pago
      const response = await axios.post(url, preference, { headers })

      // Enviar la respuesta con el ID de preferencia y otros datos útiles
      res.status(200).json({
        data: response.data,
        // id: response.data.id,
        init_point: response.data.init_point, // URL para redirigir al checkout
        // sandbox_init_point: response.data.sandbox_init_point, // URL de prueba
      })
    } catch (error: any) {
      console.error('Error al crear preferencia:', error.response?.data || error.message)
      res.status(500).json({
        error: error.response?.data || 'No se pudo crear la preferencia de pago',
      })
    }
}

export const registrarPedidoComoPagado = async (req: express.Request, res: express.Response) =>{
    const idPedido = req.params.idPedido
    const pedido = await PedidoModel.findById(idPedido)

    if (!pedido) {
      return res.status(404).send('El pedido no existe')
    }

    pedido.pagado = true
    await pedido.save()

    res.sendStatus(204);
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
