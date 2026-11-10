const express = require(`express`);
const controllerService = require (`../controllers/eventController`);

const router = express.Router();

router.get('/eventos', controllerService.getAll);

module.exports = router;