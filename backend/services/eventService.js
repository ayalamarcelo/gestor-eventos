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

const updateEventById = async (id, datos) => {

  const evento = validarEvento(datos, { parcial: true });

  if (Object.keys(evento).length === 0) {
    throw badRequest('Envíe al menos un campo: titulo, descripcion, fecha_hora o direccion');
  }
  const rowsAffected = await eventRepository.updateEventById(id, evento);
  if (rowsAffected === 0) {
    throw notFound(`No se encuentra evento a actualizar con id: ${id}`);
  }
};

const createEvent = async (datos) => {
  const evento = validarEvento(datos);
  return await eventRepository.createEvent(evento);
};

const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const notFound = (message) => {
  const error = new Error(message);
  error.status = 404;
  return error;
}

const LIMITES = { titulo: 120, direccion: 200, descripcion: 500 };

const validarEvento = (datos, { parcial = false } = {}) => {
  const body = datos || {};
  const evento = {};

  if (!parcial || body.titulo !== undefined) {
    if (typeof body.titulo !== 'string' || !body.titulo.trim()) throw badRequest('El título es obligatorio');
    if (body.titulo.length > LIMITES.titulo) throw badRequest(`El título no puede superar ${LIMITES.titulo} caracteres`);
    evento.titulo = body.titulo.trim();
  }

  if (!parcial || body.direccion !== undefined) {
    if (typeof body.direccion !== 'string' || !body.direccion.trim()) throw badRequest('La dirección es obligatoria');
    if (body.direccion.length > LIMITES.direccion) throw badRequest(`La dirección no puede superar ${LIMITES.direccion} caracteres`);
    evento.direccion = body.direccion.trim();
  }

  if (!parcial || body.descripcion !== undefined) {
    const { descripcion } = body;
    if (descripcion != null && (typeof descripcion !== 'string' || descripcion.length > LIMITES.descripcion)) {
      throw badRequest(`La descripción debe ser texto de hasta ${LIMITES.descripcion} caracteres`);
    }
    evento.descripcion = descripcion ?? null;
  }

  if (!parcial || body.fecha_hora !== undefined) {
    const fecha = new Date(body.fecha_hora);
    if (!body.fecha_hora || Number.isNaN(fecha.getTime())) throw badRequest('La fecha y hora no es válida');
    evento.fecha_hora = fecha;
  }

  return evento;
};

module.exports = { getAll, getEventById, deleteEventById, updateEventById, createEvent };