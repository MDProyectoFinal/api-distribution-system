import express from 'express'
import { crearUrlPaginacion, MAX_TAMAÑO_PAGINA, MetaDataPaginacion, TipoRecursoUri } from './../paginacion/index'
import ParametrosConsultaProducto from './../paginacion/parametrosConsultaProductos'
import { ProductoModel } from './../modelos/producto'
import { TipoProductoModel } from './../modelos/tipoProducto'

export const recuperarTodos = async (req: express.Request, res: express.Response) => {
  const numeroPagina = parseInt(req.query.numeroPagina as string) || 0
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

  const urlConsulta = req.get('Host') + req.originalUrl.split('?').shift()!! + '?'
  const totalPaginas = Math.ceil(total / tamañoPagina)

  const paginaAnterior = numeroPagina > 1 ? crearUrlPaginacion(urlConsulta, new ParametrosConsultaProducto(numeroPagina, busqueda, productos.length), TipoRecursoUri.PAGINA_ANTERIOR) : null
  const paginaSiguiente = numeroPagina < totalPaginas ? crearUrlPaginacion(urlConsulta, new ParametrosConsultaProducto(numeroPagina, busqueda, productos.length), TipoRecursoUri.PAGINA_SIGUIENTE) : null

  const metaData = new MetaDataPaginacion(total, tamañoPagina, numeroPagina, totalPaginas, paginaAnterior, paginaSiguiente)
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

    return res.send(producto)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export const insertarProducto = async (req: express.Request, res: express.Response) => {
  try {
    const { nombre, descripcion, imagen, precio_unitario, stock, categoria } = req.body

    // TODO: Validaciones, getCategoria

    const tipoProducto = await TipoProductoModel.findById(categoria)

    if (!tipoProducto) {
      return res.status(400).send('El tipo de producto no existe')
    }

    const productoCreado = await ProductoModel.create({
      descripcion,
      nombre,
      imagen,
      precio_unitario,
      stock,
      tipoProducto: tipoProducto._id,
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

    const { nombre, descripcion, imagen, precio_unitario, stock, categoria } = req.body

    // TODO: Validaciones, getCategoria

    const tipoProducto = await TipoProductoModel.findById(categoria)

    if (!tipoProducto) {
      return res.status(400).send('El tipo de producto no existe')
    }

    const productoModificado = await ProductoModel.findOneAndReplace(
      { _id: id },
      {
        descripcion,
        nombre,
        imagen,
        precio_unitario,
        stock,
        tipoProducto: tipoProducto._id,
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
