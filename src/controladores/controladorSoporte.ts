import { Request, Response } from 'express'
import { UsuarioModel } from '../modelos/usuario'
const path = require('path')
const pathCarpetaManuales = path.join(__dirname, '..', 'manuales-usuario')

export const descargarManualUsuario = async (request: Request, response: Response) => {

  let pathArchivo = ''

  if (request.usuario?.rol.toLowerCase() === 'admin') {
    pathArchivo = path.join(pathCarpetaManuales, 'Manual_Administrador.pdf')
  } else {
    pathArchivo = path.join(pathCarpetaManuales, 'Manual_Usuario.pdf')
  }

  return response.download(pathArchivo, (err) => {
    if (err) {
      return response.status(404).send('No se encontró el archivo')
    }
  })
}
