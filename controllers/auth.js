const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers");
const { googleVerify } = require("../helpers/google-verify");



const login = async(req, res = response) => { 

  const { correo, password } = req.body

  try {
    // VERIFICAR SI EL EMAIL EXISTE
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correos'
      })
    }
    // si el usuario esta activo

    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false'
      })
    }
    // verificar copntrasena
    
    const validPassword = bcryptjs.compareSync( password, usuario.password );
    if ( !validPassword ) {
      return res.status(400).json({
        msg: ' Usuario / Password no son correctos - password'
      })
    }




    // generar el jwt
    const token = await generarJWT( usuario.id)



    res.json(
      {
        usuario,
        token
      }
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Hable con el administrador' })
  }


}


const googleSignIn = async (req, res = response) => {

  const { id_token } = req.body

  const { nombre, img, correo } = await googleVerify( id_token )

  let usuario = await Usuario.findOne( { correo })

  if (!usuario) {
    const data = {
      nombre, 
      correo,
      password: ':p',
      img,
      google: true,
      rol: 'USER_ROLE'
    }

    usuario = new Usuario( data )
    await usuario.save()

  }

  if (!usuario.estado ){
    return res.status(401).json(
      {
        msg:'hable con el administrador, usaurio bloqueado'
      }
    )
  }

  const token = await generarJWT( usuario.id )

  res.json({
    usuario,
    token
  })
}

const renovarToken = async ( req, res=response) =>{

  const { usuario } = req

  // generar el jwt
  const token = await generarJWT( usuario.id)

  res.json({
    usuario,
    token
  })

}

module.exports = {
  login,
  googleSignIn,
  renovarToken
}