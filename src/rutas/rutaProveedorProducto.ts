import express from 'express'
import { recuperarPorIdProveedor } from '../controladores/controladorProveedorProducto';

export const router = express.Router();

router.get('/:idProveedor', recuperarPorIdProveedor)
