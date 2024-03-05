import { TipoProductoModel } from './../modelos/tipoProducto'
import express from 'express'
import mongoose from 'mongoose'

export const recuperarTodos = async (
  req: express.Request,
  res: express.Response
) => {
  //TODO: Filtrar

  const todosTIposProductos = await TipoProductoModel.find()
  return res.send(todosTIposProductos)
}

export const recuperarPorId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params
    const tipoProducto = await TipoProductoModel.findById(id)

    if (!tipoProducto) {
      return res.status(404)
    }

    return res.send(tipoProducto)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export const insertarTipoProducto = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { descripcion } = req.body

    await TipoProductoModel.create({ descripcion })

    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export const eliminarPorId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params

    const tipoProductoEliminado = await TipoProductoModel.findByIdAndDelete(id)

    if(!tipoProductoEliminado){
        return res.sendStatus(404)
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500)
  }
}
