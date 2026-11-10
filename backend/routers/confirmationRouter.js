const express = require('express');
const confirmationController = require('../controllers/confirmationController');

const router = express.Router();

router.get('/invitados/:codigo/confirmacion', confirmationController.getByCodigo);
router.put('/invitados/:codigo/confirmacion', confirmationController.updateByCodigo);


module.exports = router;