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
const updateEventById = async (id, evento) => {
  return await eventRepository.updateEventById(id, evento)
}
module.exports = { getAll, getEventById, deleteEventById, updateEventById };