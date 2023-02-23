

const dbValidators =  require('./db-validators')
const generarJWT   =  require('./generar-JWT') 
const googleVerify =  require('./google-verify') 
const subirArchivo =  require('./subir-archivos') 



module.exports = {
 ...dbValidators, 
 ...generarJWT ,
 ...googleVerify,
 ...subirArchivo
}