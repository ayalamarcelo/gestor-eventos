const eventRepository = require('../repositories/eventRepository');

const getAll = async () => {
  return await eventRepository.getAll();
};
const getEventById = async (id) => {
  return await eventRepository.getEventById(id);
};
const deleteEventById = async (id) => {
  return await eventRepository.deleteEventById(id);
};
module.exports = { getAll, getEventById, deleteEventById };