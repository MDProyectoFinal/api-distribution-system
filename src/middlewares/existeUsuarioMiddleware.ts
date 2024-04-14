import express from 'express'
import { UsuarioModel } from '../modelos/usuario'

export const validarExisteUsuarioBody = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { idUsuario } = req.body

  const usuarioEncontrado = await UsuarioModel.find({ _id: idUsuario })

  if (!usuarioEncontrado) {
    return res.status(404).send({ message: 'Usuario no existe' })
  }

  next()
}


// Es para recuperar los ids según lo que definamos en las rutas→ :idUsuario, :idCliente, :idVendedor, :idProveedor
export const validarExisteUsuarioQuery = async (nombreCampoId : string) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const idUsuario  = req.params[nombreCampoId]

    const usuarioEncontrado = await UsuarioModel.find({ _id: idUsuario })

    if (!usuarioEncontrado) {
      return res.status(404).send({ message: 'Usuario no existe' })
    }

    next()
  }
}
