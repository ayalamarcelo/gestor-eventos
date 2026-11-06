const eventRepository = require('../Repositories/eventRepository');

const getAll = async () => {
  return await eventRepository.getAll();
};

module.exports = { getAll };