import express from 'express'

import { recuperarTodos, recuperarPorId, insertarProducto, eliminarPorId, actualizacionCompleta, actualizacionParcial } from './../controladores/controladorProducto'

export const router = express.Router()

router.get('/', recuperarTodos)
router.get('/:id', recuperarPorId)
router.post('/', insertarProducto)
router.put('/:id', actualizacionCompleta)
router.patch('/:id', actualizacionParcial)
router.delete('/:id', eliminarPorId)
