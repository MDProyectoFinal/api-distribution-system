import express from 'express'
import { crearPreferenciaPago, insertarPedido,pagarPedidoExistenteConMP,registrarPedidoComoPagado } from '../controladores/controladorPago';

export const router = express.Router()

router.post('/', crearPreferenciaPago);
router.post('/pedido', insertarPedido);
router.post('/pedido/:idPedido', pagarPedidoExistenteConMP);
router.post('/pedido/:idPedido/pagar', registrarPedidoComoPagado);