
const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos, actulizarArchivos, mostrarImagen } = require('../controllers/uploads');
const { coleccionPermitidas } = require('../helpers');
const { validarCampos, validarArchivo } = require('../middlewares')



const router = Router();

router.post('/',validarArchivo, cargarArchivos )

router.put('/:coleccion/:id',[
  validarArchivo,
  check('id', 'el id debe ser un id de mongo').isMongoId(),
  check('coleccion').custom( c =>   coleccionPermitidas( c, [ 'usuarios','productos']) ),
  validarCampos,

], actulizarArchivos)


router.get('/:coleccion/:id', [
  check('id', 'el id debe ser un id de mongo').isMongoId(),
  check('coleccion').custom( c =>   coleccionPermitidas( c, [ 'usuarios','productos']) ),
  validarCampos], mostrarImagen)


module.exports = router;