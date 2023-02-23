
const path = require('path');
const { v4 :  uuidv4 } = require('uuid')


const subirArchivos = ( files, valExtension = ['jpg', 'jpeg', 'png', 'gif'], carpeta = '') => {

  return new Promise((resolve, reject) => {

    const { archivo } = files;
  
    const nameSplit = archivo.name.split('.')
    const extension = nameSplit[ nameSplit.length - 1 ];
    
    if ( !valExtension ){
      reject( `Extension no valido ${extension}`) 
    }
    
    
    
    const nameTemp = uuidv4() + '.' + extension
    uploadPath = path.join( __dirname, '../uploads/', carpeta,  nameTemp)
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(uploadPath, function(err) {
      if (err) {reject( err )}

      resolve( nameTemp )
    });


  })

  




}

module.exports = {
  subirArchivos
}