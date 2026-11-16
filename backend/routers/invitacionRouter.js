const express = require('express')
const invitacionController = require('../controllers/invitacionController')

const router = express.Router()

router.get('/:codigo', invitacionController.obtenerInvitacionPorCodigo)
router.post('/:codigo/confirmacion', invitacionController.confirmarAsistencia)

module.exports = router