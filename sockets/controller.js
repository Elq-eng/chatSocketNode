const { Socket } = require("socket.io")
const { comprobarJWT } = require('../helpers')
const { ChatMensajes } = require('../models')


const chatMensajes = new ChatMensajes()

const socketController = async ( socket = new Socket(), io) =>{

  const usuario = await comprobarJWT(socket.handshake.headers['x-token'])

  if (!usuario){
    return socket.disconnect()
  }
  

  //agregar el usuariuo
  chatMensajes.conectarUsuario( usuario )
  io.emit('usuarios-activos', chatMensajes.usuariosArr)
  io.emit('recibir-mensajes', chatMensajes.ultimos10)

  // Conectarlo a una sala especial
  socket.join( usuario.id ); // global, socket.id, usuario.id


  //limpiar mensaje 
  socket.on('disconnect', () =>{
    chatMensajes.desconectarUsuario( usuario.id)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
  })


  //enviar mensaje
  socket.on('enviar-mensaje', ({uid, mensaje}) =>{

    if ( uid ) {
      // Mensaje privado
      socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });
    } else {
      chatMensajes.enviarMensajes(usuario.id, usuario.nombre, mensaje)
      io.emit('recibir-mensajes', chatMensajes.ultimos10)
  }
  })



}


module.exports = {
  socketController
}