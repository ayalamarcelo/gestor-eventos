const express = require(`express`);
const controllerService = require (`../controllers/eventController`);

const router = express.Router();

router.get('/eventos', controllerService.getAll);
router.get('/eventos/:id', controllerService.getEventById);
router.delete('/eventos/:id', controllerService.deleteEventById);
router.put('/eventos/:id', controllerService.updateEventById);
router.post('/eventos', controllerService.createEvent);
module.exports = router;