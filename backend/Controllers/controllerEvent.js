const eventService = require('../Services/eventService');

const getAll = async (req, res) => {
  try {
    const eventos = await eventService.getAll();
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll };