
const { Router } =  require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares')
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos') 
const { existeProductoPorId } = require('../helpers/db-validators')

const router = Router()



router.get('/', obtenerProductos)

router.get('/:id',[
  check('id', 'El id es obligatorio').isMongoId(),
  check('id').custom( existeProductoPorId),
  validarCampos
] ,obtenerProducto)


// crear categoria - privado - cualquier persona con un token valido
router.post('/',[ 
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'la categoria es obligatorio').isMongoId(),
  check('categoria').custom( existeProductoPorId ),
  validarCampos
  ], crearProducto )

router.put('/:id',[
  validarJWT,
  // check('categoria', 'la categoria es obligatorio').isMongoId(),
  check('id').custom( existeProductoPorId),
  validarCampos
] ,actualizarProducto)


router.delete('/:id',[
  validarJWT,
  esAdminRole,
  check( 'id', 'No es un id de mongo ').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos
], borrarProducto)

module.exports = router;