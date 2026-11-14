const express = require('express');
const guestController = require('../controllers/guestController');

const router = express.Router();

router.post('/eventos/:eventoId/invitados', guestController.crear);
router.get('/eventos/:eventoId/invitados', guestController.listar);

module.exports = router;