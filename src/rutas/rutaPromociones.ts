import express from 'express'


import { recuperarTodos, } from './../controladores/controladorPromociones';


export const router = express.Router();

router.get('/', recuperarTodos);
// router.get('/:id', recuperarPorId);
 router.post('/', insertarTipoPromocion);
// router.delete('/:id', eliminarPorId)
