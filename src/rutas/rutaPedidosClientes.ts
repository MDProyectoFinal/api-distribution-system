import express from 'express'

import { recuperarTodos, recuperarPorId, insertarPedido, eliminarPorId } from './../controladores/controladorPedidosClientes'
const md_aute = require('../middlewares/autenticacion');
const md_admin = require('../middlewares/esAdmin')


export const router = express.Router()

router.get('/:idCliente/pedidos/', recuperarTodos)
router.get('/:idCliente/pedidos/:idPedido', recuperarPorId)
router.post('/:idCliente/pedidos/',[md_aute.asegurarAutenticacion, md_admin.esAdmin], insertarPedido)
router.delete('/:idCliente/pedidos/:idPedido', eliminarPorId)