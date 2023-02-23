const { response } = require("express");


const esAdminRole = ( req, res = response, next ) => {

  if ( !req.usuario ){
    return res.status(500).json({
      msg: 'Token no valido - usuario con estado: false'
    })
  }

  const { rol, nombre }= req.usuario;

  if ( rol != 'ADMIN_ROLE'){
    return res.status(401).json({
      msg: `${ nombre } no es administrador - No puede hacer esto`
    })
  }

  next();
}


const tieneRole = ( ...roles  ) => {

  return (req, res, next) => {

    if ( !req.usuario ){
    return res.status(500).json({
      msg: 'Token no valido - usuario con estado: false'
    })
  }

  

  if ( roles.includes( req.usuario.rol)){
    return res.status(401).json({
      msg: ` no es administrador - No puede hacer esto`
    })
  }
    next()
  }
}

module.exports = {
  esAdminRole: esAdminRole,
  tieneRole
}