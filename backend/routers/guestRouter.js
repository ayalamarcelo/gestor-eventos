const express = require('express');
const guestController = require('../controllers/guestController');

const router = express.Router();

router.post('/eventos/:eventoId/invitados', guestController.crearInvitado);
router.get('/eventos/:eventoId/invitados', guestController.listarInvitado);
router.delete('/eventos/:eventoId/invitados/:invitadoId', guestController.eliminarInvitado);

module.exports = router;