const express = require('express');
const confirmationController = require('../controllers/confirmationControllerW');

const router = express.Router();

router.get('/eventos/:eventoId/confirmaciones', confirmationController.obtenerReporte);

module.exports = router;
