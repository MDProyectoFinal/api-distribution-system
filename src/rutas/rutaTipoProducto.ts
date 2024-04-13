
import express from 'express'


import { recuperarTodos, recuperarPorId, insertarTipoProducto, eliminarPorId } from './../controladores/controladorTipoProducto';


export const router = express.Router();

router.get('/', recuperarTodos);
router.get('/:id', recuperarPorId);
router.post('/', insertarTipoProducto);
router.delete('/:id', eliminarPorId)
