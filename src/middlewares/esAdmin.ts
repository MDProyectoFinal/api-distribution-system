// Usar 'asegurarAutenticacion' antes de este middleware.
exports.esAdmin = function(req: any, res: any, next: any) {

  if (!req.usuario) {
    return res.status(403).send('No hay información de usuario en la solicitud.');
  }

  if (req.usuario.rol.toUpperCase() === 'ADMIN') {
    next();
  } else {
    return res.status(403).send('Acceso denegado. No tienes permisos de administrador.');
  }
};