import express from 'express'


import { insertarPromocion, recuperarPorId, actualizarPromocion, recuperarTodasPorProducto} from './../controladores/controladorPromociones';


export const router = express.Router();

 router.get('/:idProducto/promociones', recuperarTodasPorProducto);
 router.post('/:idProducto/promociones', insertarPromocion);
 router.put('/:idProducto/promociones/:idPromocion', actualizarPromocion);
// // router.delete('/:id', eliminarPorId)
