const confirmationRepository = require('../repositories/confirmationRepository');

const obtenerReporteConfirmaciones = async (eventoId, restriccion) => {
  const evento = await confirmationRepository.buscarEventoPorId(eventoId);
  if (!evento) {
    const error = new Error('El evento especificado no existe');
    error.statusCode = 404;
    throw error;
  }

  const confirmaciones = await confirmationRepository.buscarConfirmaciones(eventoId, restriccion);

  return {
    evento,
    confirmaciones,
    total: confirmaciones.length
  };
};

module.exports = {
  obtenerReporteConfirmaciones
};