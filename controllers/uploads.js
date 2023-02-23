const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { subirArchivos } = require('../helpers');
const { Usuario, Producto } = require('../models');



const cargarArchivos = async( req, res= response ) => {



  // imagenes

  try {    
    const extensions = [ 'txt' ]
    // const name  = await subirArchivos(req.files, extensions, 'textos')
    const name  = await subirArchivos(req.files, undefined, 'imgs')

   
    res.json( {  name } )
  }
  catch( msg ){
    res.json( { msg })
  }


}


const actulizarArchivos = async( req, res = response ) => {

  const { coleccion, id } = req.params

  switch ( coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if ( !modelo ){
        return res.status( 404 ).json({ msg: 'No existe el usuario con el id'})
      }

      break;

      case 'productos':
        modelo = await Producto.findById(id)
        if ( !modelo ){
          return res.status( 404 ).json({ msg: 'No existe el producto con el id'})
        }
  
        break;
  
    default:
      return res.status( 404 ).json({ msg: 'No existe esta coleccion' })
  }

  //borrar imagen del servidor
  if ( modelo.img ){
    const pathImage = path.join(__dirname, '../uploads/', coleccion , modelo.img)
    if ( fs.existsSync(pathImage) ){
      fs.unlinkSync(pathImage)
    }

    }

  const name  = await subirArchivos(req.files, undefined, coleccion)
  modelo.img = name
  await modelo.save()


  res.json({modelo})

}

const mostrarImagen = async (req,res = response) => {

  const { coleccion, id } = req.params

  switch ( coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if ( !modelo ){
        return res.status( 404 ).json({ msg: 'No existe el usuario con el id'})
      }

      break;

      case 'productos':
        modelo = await Producto.findById(id)
        if ( !modelo ){
          return res.status( 404 ).json({ msg: 'No existe el producto con el id'})
        }
  
        break;
  
    default:
      return res.status( 404 ).json({ msg: 'No existe esta coleccion' })
  }

    //mostrar imagen
  if ( modelo.img ){
      const pathImage = path.join(__dirname, '../uploads/', coleccion , modelo.img)
      if ( fs.existsSync(pathImage) ){
        return res.sendFile( pathImage )
      }

    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile( pathImagen ) 
}


module.exports = { cargarArchivos, actulizarArchivos,mostrarImagen }