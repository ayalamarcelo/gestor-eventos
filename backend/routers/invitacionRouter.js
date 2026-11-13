const express = require('express')
const invitacionController = require('../controllers/invitacionController')

const router = express.Router()

router.get('/:codigo', invitacionController.obtenerInvitacionPorCodigo)

module.exports = router