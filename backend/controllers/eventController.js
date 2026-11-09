const eventService = require('../services/eventService');

const getAll = async (req, res) => {
  try {
    const eventos = await eventService.getAll();
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Ingrese un valor númerico' });
    }

    const event = await eventService.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: `No se encuentra evento con id: ${id}` });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteEventById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Ingrese un valor númerico' });
    }
    const rowsAffected = await eventService.deleteEventById(id);

    if (rowsAffected === 0) {
      return res.status(404).json({ error: `No se encuentra evento a eliminar con id: ${id}` });
    }

    res.status(200).json({ mensaje: 'Se ha eliminado el evento con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getAll, getEventById, deleteEventById};