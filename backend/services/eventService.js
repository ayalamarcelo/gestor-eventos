const eventRepository = require('../repositories/eventRepository');

const getAll = async () => {
  return await eventRepository.getAll();
};

module.exports = { getAll };