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

const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const createEvent = async (datos) => {
  const { titulo, descripcion, fecha_hora, direccion } = datos || {};

  if (typeof titulo !== 'string' || !titulo.trim()) throw badRequest('El título es obligatorio');
  if (titulo.length > 120) throw badRequest('El título no puede superar 120 caracteres');
  if (typeof direccion !== 'string' || !direccion.trim()) throw badRequest('La dirección es obligatoria');
  if (direccion.length > 200) throw badRequest('La dirección no puede superar 200 caracteres');
  if (descripcion != null && (typeof descripcion !== 'string' || descripcion.length > 500)) {
    throw badRequest('La descripción debe ser texto de hasta 500 caracteres');
  }

  const fecha = new Date(fecha_hora);
  if (!fecha_hora || Number.isNaN(fecha.getTime())) throw badRequest('La fecha y hora no es válida');

  return await eventRepository.create({
    titulo: titulo.trim(),
    descripcion: descripcion ?? null,
    fecha_hora: fecha,
    direccion: direccion.trim()
  });
};

module.exports = { getAll, getEventById, deleteEventById, updateEventById, createEvent };