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

const updateEventById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updatedEvent = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Ingrese un valor númerico' });
    }
    const camposPermitidos = ['titulo', 'descripcion', 'fecha_hora', 'direccion'];
    const body = req.body || {};
    const evento = {};

    for (const campo of camposPermitidos) {
      if (body[campo] !== undefined) {
        evento[campo] = body[campo];
      }
    }

    if (Object.keys(evento).length === 0) {
      return res.status(400).json({ error: 'Envíe al menos un campo para actualizar: titulo, descripcion, fecha_hora o direccion' });
    }

    if (evento.titulo !== undefined &&
      (typeof evento.titulo !== 'string' || evento.titulo.trim() === '' || evento.titulo.length > 120)) {
      return res.status(400).json({ error: 'El título es obligatorio y no puede superar los 120 caracteres' });
    }

    if (evento.direccion !== undefined &&
      (typeof evento.direccion !== 'string' || evento.direccion.trim() === '' || evento.direccion.length > 200)) {
      return res.status(400).json({ error: 'La dirección es obligatoria y no puede superar los 200 caracteres' });
    }

    if (evento.descripcion !== undefined && evento.descripcion !== null &&
      (typeof evento.descripcion !== 'string' || evento.descripcion.length > 500)) {
      return res.status(400).json({ error: 'La descripción no puede superar los 500 caracteres' });
    }

    if (evento.fecha_hora !== undefined && isNaN(new Date(evento.fecha_hora).getTime())) {
      return res.status(400).json({ error: 'La fecha y hora no son válidas' });
    }

    const rowsAffected = await eventService.updateEventById(id, updatedEvent);
    if (rowsAffected === 0){
      return res.status(404).json({ error: `No se encuentra evento a actualizar con id: ${id}` })
    }

    res.status(200).json({ mensaje: 'Se ha actualizado el evento con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getAll, getEventById, deleteEventById, updateEventById };