import express from 'express'

import { recuperarTodos, recuperarPorId, insertarPedido, eliminarPorId } from './../controladores/controladorPedidosClientes'

export const router = express.Router()

router.get('/:idCliente/pedidos/', recuperarTodos)
router.get('/:idCliente/pedidos/:idPedido', recuperarPorId)
router.post('/:idCliente/pedidos/', insertarPedido)
router.delete('/:idCliente/pedidos/:idPedido', eliminarPorId)