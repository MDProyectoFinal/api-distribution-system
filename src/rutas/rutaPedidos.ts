import express from 'express'

import { recuperarTodos, recuperarPorId, insertarPedido, eliminarPorId, actualizacionCompleta, actualizacionParcial, recuperarPorFiltros, cambiarEstadoPorIdPedido } from './../controladores/controladorPedido'
import { validarExisteUsuarioBody } from "./../middlewares/existeUsuarioMiddleware";

export const router = express.Router()

router.get('/', recuperarTodos)
router.post('/filtrar', recuperarPorFiltros)
router.get('/:idPedido', recuperarPorId)
//router.post('/', validarExisteUsuarioBody, insertarPedido)
router.post('/', insertarPedido)
//router.put('/:idPedido', validarExisteUsuarioBody, actualizacionCompleta)
router.put('/:idPedido', actualizacionCompleta)
router.patch('/:idPedido', actualizacionParcial)
router.delete('/:idPedido', eliminarPorId)
router.put('/cambiarEstadoPedido/:idPedido', cambiarEstadoPorIdPedido)