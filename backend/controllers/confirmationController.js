const confirmationService = require('../services/confirmationService');
const { organizadorId } = require('../database/config');

const responderError = (res, error) => {
  res.status(error.status || 500).json({ error: error.message });
};

const getByCodigo = async (req, res) => {
  try {
    const confirmacion = await confirmationService.getByCodigo(req.params.codigo);
    res.status(200).json(confirmacion);
  } catch (error) {
    responderError(res, error);
  }
};

const updateByCodigo = async (req, res) => {
  try {
    const confirmacion = await confirmationService.updateByCodigo(
      req.params.codigo,
      req.body
    );
    res.status(200).json(confirmacion);
  } catch (error) {
    responderError(res, error);
  }
};


module.exports = {
  getByCodigo,
  updateByCodigo
};
