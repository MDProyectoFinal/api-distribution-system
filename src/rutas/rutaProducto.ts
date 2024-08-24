import express from 'express'
import multer from 'multer';

const upload = multer({ dest: './uploads/' });


import { recuperarTodos, recuperarPorId, insertarProducto, eliminarPorId, actualizacionCompleta, actualizacionParcial } from './../controladores/controladorProducto'

export const router = express.Router()

router.get('/', recuperarTodos)
router.get('/:id', recuperarPorId)
router.post('/', upload.single('image'), insertarProducto)
router.put('/:id', upload.single('image'),actualizacionCompleta)
router.patch('/:id', actualizacionParcial)
router.delete('/:id', eliminarPorId)
