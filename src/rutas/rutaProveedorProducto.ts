import express from 'express'
// var md_aute = require('../middlewares/autenticacion');

import { recuperarPorIdProveedor } from '../controladores/controladorProveedorProducto';

export const router = express.Router();

// router.get('/:id', recuperarPorId)
router.get('/:idProveedor', recuperarPorIdProveedor)
