import express from 'express'
import { crearPreferenciaPago } from '../controladores/controladorPago';

export const router = express.Router()

router.post('/', crearPreferenciaPago);

// router.get('/', recuperarTodos)
// router.post('/filtrar', recuperarPorFiltros)
// router.get('/:idPedido', recuperarPorId)
// //router.post('/', validarExisteUsuarioBody, insertarPedido)
// router.post('/', insertarPedido)
// //router.put('/:idPedido', validarExisteUsuarioBody, actualizacionCompleta)
// router.put('/:idPedido', actualizacionCompleta)
// router.patch('/:idPedido', actualizacionParcial)
// router.delete('/:idPedido', eliminarPorId)
// router.put('/cambiarEstadoPedido/:idPedido', cambiarEstadoPorIdPedido)