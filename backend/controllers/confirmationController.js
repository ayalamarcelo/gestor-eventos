const confirmacionService = require('../services/confirmacionService');

const obtenerReporte = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { restriccion } = req.query;

    const resultado = await confirmacionService.obtenerReporteConfirmaciones(eventoId, restriccion);

    return res.status(200).json(resultado);
  } catch (error) {
    const codigoEstado = error.statusCode || 500;
    return res.status(codigoEstado).json({ error: error.message });
  }
};

module.exports = {
  obtenerReporte
};