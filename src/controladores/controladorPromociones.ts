import express from 'express'
import { ProductoModel } from './../modelos/producto'
import { PromocionModel, Promocion } from './../modelos/promocion'

export const insertarPromocion = async (req: express.Request, res: express.Response) => {
  try {
    const { fechaInicio, fechaFin, precio } = req.body
    const { idProducto } = req.params

    const producto = await ProductoModel.findById(idProducto)

    if (!producto) {
      return res.status(404)
    }

    const nuevaPromocion: Promocion = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      precio: precio,
      activa: true,
    }

    const promocionesEnRangoFecha = producto.promociones.filter((promocion) => {
      const fechaFinPromocion = promocion.fecha_fin || new Date('9999-12-31')
      const fechaFinNuevaPromocion = nuevaPromocion.fecha_fin || new Date('9999-12-31')

      return (promocion.activa && promocion.fecha_inicio <= nuevaPromocion.fecha_inicio && fechaFinPromocion >= nuevaPromocion.fecha_inicio) || (promocion.fecha_inicio <= fechaFinNuevaPromocion && fechaFinPromocion >= fechaFinNuevaPromocion) || (promocion.fecha_inicio >= nuevaPromocion.fecha_inicio && fechaFinPromocion <= fechaFinNuevaPromocion)
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

export const actualizararPromocion = async (req: express.Request, res: express.Response) => {
  const { idProducto, idPromocion } = req.params

  const { fecha_inicio, fecha_fin, precio, activa } = req.body



  const promocion = await ProductoModel.find(
    {
      'promociones._id': idPromocion,
    },
    { 'promociones.$': true }
  )

  if (!promocion) {
    throw new Error('Promocion no encontrada')
  }

  await ProductoModel.updateOne(
    {_id : idProducto, "promociones._id" : idPromocion},
    {
      $set: {
        'promociones.$.fecha_inicio': fecha_inicio,
        'promociones.$.fecha_fin': fecha_fin,
        'promociones.$.precio': precio,
        'promociones.$.activa': activa,
      }
    }
  )

  return res.sendStatus(204)
}
