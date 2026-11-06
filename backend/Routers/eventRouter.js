const express = require(`express`);
const controllerService = require (`../Controllers/controllerEvent`);

const router = express.Router();

router.get('/eventos', controllerService.getAll);

module.exports = router;