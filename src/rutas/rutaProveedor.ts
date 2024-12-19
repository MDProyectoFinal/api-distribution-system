import express from 'express'
var md_aute = require('../middlewares/autenticacion');

import { recuperarTodos, recuperarPorId, obtenerProveedoresPorRazonSocial, insertarProveedor, editarProveedor, eliminacionLogica, eliminarPorId } from './../controladores/controladorProveedor';

export const router = express.Router();

router.get('/', recuperarTodos)
router.get('/:id', recuperarPorId)
router.get('/obtenerProveedores/:razonSocial', md_aute.asegurarAutenticacion, obtenerProveedoresPorRazonSocial)
router.post('/', md_aute.asegurarAutenticacion, insertarProveedor)
router.post('/:id', md_aute.asegurarAutenticacion, editarProveedor)
router.patch('/eliminacionLogica/:id', md_aute.asegurarAutenticacion, eliminacionLogica)
router.delete('/:id', md_aute.asegurarAutenticacion, eliminarPorId)