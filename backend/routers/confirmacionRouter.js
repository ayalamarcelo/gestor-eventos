const express = require('express');
const confirmacionController = require('./confirmacion.controller');

const router = express.Router();

router.get('/eventos/:eventoId/confirmaciones', confirmacionController.obtenerReporte);

module.exports = router;
