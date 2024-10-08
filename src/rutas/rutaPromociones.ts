import express from 'express'


import { insertarPromocion, recuperarPorId, actualizararPromocion as actualizarPromocion} from './../controladores/controladorPromociones';


export const router = express.Router();

// router.get('/', recuperarTodos);
 router.get('/:id', recuperarPorId);
 router.post('/:idProducto/promociones', insertarPromocion);
 router.put('/:idProducto/promociones/:idPromocion', actualizarPromocion);
// // router.delete('/:id', eliminarPorId)
