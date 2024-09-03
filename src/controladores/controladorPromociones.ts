import { PromocionModel } from 'modelos/promocion';
import { TipoPromocionModel } from './../modelos/tipoPromocion';
import express from 'express'
import { TipoProductoModel } from 'modelos/tipoProducto';
import cloudinary from 'servicios/cloudinary.config';
import fs from 'fs'

export const recuperarTodos = async (
  req: express.Request,
  res: express.Response
) => {
  //TODO: Filtrar

  const todosTIposProductos = await TipoPromocionModel.find()
  return res.send(todosTIposProductos)
}

export const insertarTipoPromocion = async (
    req: express.Request,
    res: express.Response
  ) =>{
    try {
        const { nombre, descripcion, precio_unitario, stock, tipoProducto } = req.body
        const imagen = req.file?.path
        let urlImagen

        if (!nombre) {
          return res.status(400).send('El nombre no puede estar vacío.')
        }

        if (!descripcion) {
          return res.status(400).send('La descripción no puede estar vacía.')
        }

        if (stock < 0) {
          return res.status(400).send('El stock debe ser mayor que 0.')
        }

        if (!precio_unitario) {
          return res.status(400).send('El precio unitario no puede estar vacío.')
        }

        const existe = await PromocionModel.findOne({ nombre: nombre })

        if (existe) {
          return res.status(400).send('Ya existe un producto con ese nombre')
        }

        const tipoProductoEncontrado = await TipoProductoModel.findById(tipoProducto)

        if (!tipoProductoEncontrado) {
          return res.status(400).send('El tipo de producto no existe')
        }

        if (imagen) {
          try {
            await cloudinary.v2.uploader.upload(imagen!!, (err, result) => {
              fs.unlinkSync(imagen)
              urlImagen = result?.url
            })
          } catch (error) {
            console.error(error)

            return res.status(500).send({ message: 'Error subiendo la imagen' })
          }
        }

        const productoCreado = await PromocionModel.create({
          descripcion,
          nombre,
          imagen: urlImagen,
          precio_unitario,
          stock,
          tipoProducto: tipoProductoEncontrado._id,
        })

        return res.status(201).send(productoCreado)
      } catch (error) {
        return res.sendStatus(500)
      }
}