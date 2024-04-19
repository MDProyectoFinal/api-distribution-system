import express from 'express'

import { recuperarTodos, recuperarPorId, insertarPedido, eliminarPorId } from './../controladores/controladorPedidosClientes'
import { validarExisteUsuarioBody } from "./../middlewares/existeUsuarioMiddleware";

export const router = express.Router()

router.get('/:idCliente/pedidos/', recuperarTodos)
router.get('/:idCliente/pedidos/:idPedido', recuperarPorId)
//router.post('/', validarExisteUsuarioBody, insertarPedido)
router.post('/:idCliente/pedidos/', insertarPedido)
//router.put('/:idPedido', validarExisteUsuarioBody, actualizacionCompleta)
router.delete('/:idCliente/pedidos/:idPedido', eliminarPorId)