import express from 'express'
import cloudinary from '../servicios/cloudinary.config'
import { crearUrlPaginacion, MAX_TAMAÑO_PAGINA, MetaDataPaginacion, TipoRecursoUri } from './../paginacion/index'
import ParametrosConsultaProducto from './../paginacion/parametrosConsultaProductos'
import { ProductoModel } from './../modelos/producto'
import { TipoProductoModel } from './../modelos/tipoProducto'
import fs from 'fs'
import { ProductoConPromocionDTO } from 'dominio/dtos/productos/producto-promocion'

export const recuperarTodos = async (req: express.Request, res: express.Response) => {
  const numeroPagina = parseInt(req.query.numeroPagina as string) || 1
  let tamañoPagina = parseInt(req.query.tamañoPagina as string) || 10
  const busqueda = (req.query.buscar as string) || ''
  const tipo = (req.query.tipo as string) || 'todos'

  if (tamañoPagina > MAX_TAMAÑO_PAGINA) {
    tamañoPagina = MAX_TAMAÑO_PAGINA
  }

  let idsTipos = await buscarIdsTiposProductos(tipo)

  const productos = await ProductoModel.find({
    nombre: { $regex: busqueda, $options: 'i' },
  })
    .where('tipoProducto')
    .in(idsTipos)
    .skip((numeroPagina - 1) * tamañoPagina)
    .limit(tamañoPagina)

  const total = await ProductoModel.countDocuments({
    tipoProducto: { $in: idsTipos },
    nombre: { $regex: busqueda, $options: 'i' },
  })

  const urlConsulta = req.protocol + '://' + req.get('Host') + req.originalUrl.split('?').shift()!! + '?'
  const totalPaginas = Math.ceil(total / tamañoPagina)

  const paginaAnterior = numeroPagina > 1 ? crearUrlPaginacion(urlConsulta, new ParametrosConsultaProducto(numeroPagina, busqueda, tamañoPagina), TipoRecursoUri.PAGINA_ANTERIOR) : null
  const paginaSiguiente = numeroPagina < totalPaginas ? crearUrlPaginacion(urlConsulta, new ParametrosConsultaProducto(numeroPagina, busqueda, tamañoPagina), TipoRecursoUri.PAGINA_SIGUIENTE) : null

  const metaData = new MetaDataPaginacion(total, tamañoPagina, numeroPagina, totalPaginas, paginaAnterior, paginaSiguiente)
  res.setHeader('Access-Control-Expose-Headers', 'x-paginacion')
  res.setHeader('x-paginacion', JSON.stringify(metaData))

  res.status(200).send(productos)
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

export const insertarProducto = async (req: express.Request, res: express.Response) => {
  try {
    const { nombre, descripcion, precio_unitario, stock, tipoProducto, destacado } = req.body
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

    const existe = await ProductoModel.findOne({ nombre: nombre })

    if (existe) {
      return res.status(400).send('Ya existe un producto con ese nombre')
    }

    const tipoProductoEncontrado = await TipoProductoModel.findById(tipoProducto)

    if (!tipoProductoEncontrado) {
      return res.status(400).send('El tipo de producto no existe')
    }

    if (imagen) {
      try {
        await cloudinary.v2.uploader.upload(imagen!!, (err: any, result: any) => {
          fs.unlinkSync(imagen)
          urlImagen = result?.url
        })
      } catch (error) {
        console.error(error)

        return res.status(500).send({ message: 'Error subiendo la imagen' })
      }
    }

    const productoCreado = await ProductoModel.create({
      descripcion,
      nombre,
      imagen: urlImagen,
      precio_unitario,
      stock,
      destacado,
      tipoProducto: tipoProductoEncontrado._id,
    })

    return res.status(201).send(productoCreado)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export const eliminarPorId = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const tipoProductoEliminado = await ProductoModel.findByIdAndDelete(id)

    if (!tipoProductoEliminado) {
      return res.sendStatus(404)
    }

    return res.sendStatus(204)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export const actualizacionCompleta = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const { nombre, descripcion, precio_unitario, stock, tipoProducto, destacado } = req.body

    const imagen = req.file?.path
    let urlImagen

    const productoMismoNombre = await ProductoModel.findOne({ nombre: nombre, _id: { $ne: id } })

    if (productoMismoNombre) {
      return res.status(400).send('Ya existe un producto con ese nombre')
    }

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

    if (imagen) {
      try {
        await cloudinary.v2.uploader.upload(imagen!!, (err: any, result: any) => {
          fs.unlinkSync(imagen)
          urlImagen = result?.url
        })
      } catch (error) {
        console.error(error)

        return res.status(500).send({ message: 'Error subiendo la imagen' })
      }
    }

    const tipoProductoEncontrado = await TipoProductoModel.findById(tipoProducto)

    if (!tipoProductoEncontrado) {
      return res.status(400).send('El tipo de producto no existe')
    }

    console.log(destacado);


    const productoModificado = await ProductoModel.updateOne(
      {
        _id: id,
        $or: [{ descripcion: { $ne: descripcion } }, { nombre: { $ne: nombre } }, { precio_unitario: { $ne: precio_unitario } }, { imagen: { $ne: urlImagen } }, { stock: { $ne: stock } }, { destacado: { $ne: destacado } }, { tipoProducto: { $ne: tipoProductoEncontrado._id } }],
      },
      {
        $set: {
          descripcion: descripcion,
          nombre: nombre,
          precio_unitario: precio_unitario,
          imagen: urlImagen,
          stock: stock,
          destacado: destacado,
          tipoProducto: tipoProductoEncontrado._id,
        },
      }
    )

    if (!productoModificado) {
      return res.sendStatus(404)
    }

    return res.sendStatus(204)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export const actualizacionParcial = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const productoModificado = await ProductoModel.findOneAndUpdate({ _id: id }, req.body)

    if (!productoModificado) {
      return res.sendStatus(404)
    }

    return res.sendStatus(204)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

async function buscarIdsTiposProductos(tipo: string) {
  if (tipo === 'todos') {
    return await TipoProductoModel.find().select('_id')
  }

  return await TipoProductoModel.where('descripcion').in(tipo.split(',')).select('_id')
}
