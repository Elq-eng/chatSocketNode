
const { response } = require('express')
const { Producto } = require('../models')



//obtener Productos
const obtenerProductos = async ( req, res = response) => {

  const { limit = 5, desde = 0 } = req.query;
  const query = { estado : true }

  const [ total, productos ] = await Promise.all([
    Producto.countDocuments( query ),
    Producto.find( query )
      .populate('usuario','nombre')
      .populate('categoria','nombre')
      .skip( Number (desde ))
      .limit( Number ( limit ))
  ])  

  res.json({
    total,
    productos
  })
}

// obtener Producto 
const obtenerProducto = async( req, res=response ) => {
  const { id } = req.params
  const producto = await Producto.findById( id ).populate( 'usuario', 'nombre' )
  .populate( 'categoria', 'nombre' )

  res.json( producto )
}


const crearProducto = async( req, res = response  )  => {

  const { estado, usuario, ...body} = req.body

  const ProductoDB = await Producto.findOne( { nombre: body.nombre });

  if ( ProductoDB ){
    return res.status(400).json(
      {msg: 'la Producto ya existe'}
    )
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(), 
    usuario: req.usuario._id
  }

  const producto = new Producto( data )

  await producto.save()

  res.status(201).json( producto )
 
}

// actualizarProducto 
const actualizarProducto = async ( req, res = response ) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if ( data.nombre ){
    data.nombre = data.nombre.toUpperCase()
  }

  data.usuario = req.usuario.__id;

  const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

  res.json( producto )
}


// borrar  Producto  - ESTADO A FALSE
const borrarProducto = async( req, res=response) => {
  const { id } = req.params;
  const ProductoBorrada = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true})

  res.json( ProductoBorrada)
}

module.exports = { 
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
 }