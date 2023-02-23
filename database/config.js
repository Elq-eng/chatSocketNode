const mongoose = require('mongoose')



const dbConnection = async( ) => {
  
  try{
    
    mongoose.set( 'strictQuery', false )
    await mongoose.connect( process.env.MONGO_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } ) 

    console.log( 'base de datos UP 🔰' );

  }catch( err ){
    console.log( err )
    throw new Error( '💪(•︡益•)👊 Error a la hora de iniciar la base de datos' )
  }

}


module.exports = {
  dbConnection
}