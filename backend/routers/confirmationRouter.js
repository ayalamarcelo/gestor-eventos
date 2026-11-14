const express = require('express');
const confirmationController = require('../controllers/confirmationController');

const router = express.Router();

router.get('/eventos/:eventoId/confirmaciones', confirmationController.obtenerReporte);
router.get('/invitados/:codigo/confirmacion', confirmationController.getByCodigo);
router.put('/invitados/:codigo/confirmacion', confirmationController.updateByCodigo);
router.put(
    '/eventos/:eventoId/invitados/:invitadoId/confirmacion',
    confirmationController.updateByInvitado
);
router.delete(
    '/eventos/:eventoId/invitados/:invitadoId/confirmacion',
    confirmationController.removeByInvitado
);

module.exports = router;
