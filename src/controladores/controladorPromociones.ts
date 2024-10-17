import express from 'express'
import { ProductoModel } from './../modelos/producto'
import { PromocionModel, Promocion } from './../modelos/promocion'
import mongoose from 'mongoose'
import { log } from 'console'
import moment from 'moment'

export const insertarPromocion = async (req: express.Request, res: express.Response) => {
  try {
    const { fecha_inicio, fecha_fin, precio } = req.body
    const { idProducto } = req.params

    const producto = await ProductoModel.findById(idProducto)

    if (!producto) {
      return res.status(404)
    }

    const nuevaPromocion: Promocion = {
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      precio: precio,
      activa: true,
    }

    const promocionesEnRangoFecha = producto.promociones.filter((promocion) => {
      const fechaInicioPromocion = moment(promocion.fecha_inicio)
      const fechaFinPromocion = moment(promocion.fecha_fin)

      const fechaInicioNuevaPromocion = moment(nuevaPromocion.fecha_fin)
      const fechaFinNuevaPromocion = moment(nuevaPromocion.fecha_fin)

      const solapadaInicioNueva = fechaInicioNuevaPromocion.isBetween(fechaInicioPromocion, fechaFinPromocion)
      const solapadaFinNueva = fechaFinNuevaPromocion.isBetween(fechaInicioPromocion, fechaFinPromocion)

      const solapadaInicioActual = fechaInicioPromocion.isBetween(fechaInicioNuevaPromocion, fechaFinNuevaPromocion)
      const solapadaFinActual = fechaFinPromocion.isBetween(fechaInicioNuevaPromocion, fechaFinNuevaPromocion)

      return promocion.activa && (solapadaInicioNueva || solapadaFinNueva || solapadaInicioActual || solapadaFinActual)
    })

    if (promocionesEnRangoFecha.length > 0) {
      return res.status(400).json({
        message: 'No se puede agregar una promoción que coincida con el rango de fechas de otra promoción activa existente.',
      })
    }

    producto.promociones.push(nuevaPromocion)
    await producto.save()
    res.status(201).json(nuevaPromocion)
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la promoción', error })
  }
}

export const recuperarPorId = async (req: express.Request, res: express.Response) => {
  const { idProducto, idPromocion } = req.params

  const producto = await ProductoModel.findById(idProducto)

  if (!producto) {
    throw new Error('Producto no encontrado')
  }

  const promocion = producto.promociones.find((p) => p._id?.toString() === idPromocion)

  if (!promocion) {
    throw new Error('Promocion no encontrada')
  }

  return res.sendStatus(200).json(promocion)
}

export const actualizarPromocion = async (req: express.Request, res: express.Response) => {
  const { idProducto, idPromocion } = req.params

  const { fecha_inicio, fecha_fin, precio, activa } = req.body

  const producto = await ProductoModel.findById(idProducto)

  if (!producto) {
    return res.status(400).json({ message: 'Producto no encontrado' })
  }

  const promocion = producto.promociones.find((p) => p._id?.toString() === idPromocion)

  if (!promocion) {
    return res.status(400).json({ message: 'Promocion no encontrada' })
  }

  const idPromoObjId = new mongoose.Types.ObjectId(idPromocion)

  const promocionesEnRangoFecha = producto.promociones.filter((promocion) => {
    const fechaInicioPromocion = moment(promocion.fecha_inicio)
    const fechaFinPromocion = moment(promocion.fecha_fin)

    const fechaInicioNueva = moment(fecha_fin)
    const fechaFinNueva = moment(fecha_fin)

    const solapadaInicioNueva = fechaInicioNueva.isBetween(fechaInicioPromocion, fechaFinPromocion)
    const solapadaFinNueva = fechaFinNueva.isBetween(fechaInicioPromocion, fechaFinPromocion)

    const solapadaInicioActual = fechaInicioPromocion.isBetween(fechaInicioNueva, fechaFinNueva)
    const solapadaFinActual = fechaFinPromocion.isBetween(fechaInicioNueva, fechaFinNueva)

    return promocion._id !== idPromoObjId && promocion.activa && (solapadaInicioNueva || solapadaFinNueva || solapadaInicioActual || solapadaFinActual)
  })

  if (promocionesEnRangoFecha.length > 0) {
    return res.status(400).json({
      message: 'No se puede agregar una promoción que coincida con el rango de fechas de otra promoción activa existente.',
    })
  }

  await ProductoModel.updateOne(
    { _id: idProducto, 'promociones._id': idPromocion },
    {
      $set: {
        'promociones.$.fecha_inicio': fecha_inicio,
        'promociones.$.fecha_fin': fecha_fin,
        'promociones.$.precio': precio,
        'promociones.$.activa': activa,
      },
    }
  )

  return res.sendStatus(204)
}

export const recuperarTodasPorProducto = async (req: express.Request, res: express.Response) => {
  const { idProducto } = req.params
  const producto = await ProductoModel.findById(idProducto)

  if (!producto) {
    return res.status(400).json({ message: 'Producto no encontrado' })
  }

  return res.status(200).json(producto)
}
