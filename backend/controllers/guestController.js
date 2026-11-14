const guestService = require('../services/guestService');

const responderError = (res, error) => {
    res.status(error.status || 500).json({ error: error.message });
};

const crear = async (req, res) => {
    try {
        const invitado = await guestService.crear(req.params.eventoId, req.body);
        res.status(201).json(invitado);
    } catch (error) {
        responderError(res, error);
    }
};

const listar = async (req, res) => {
    try {
        const invitados = await guestService.listar(req.params.eventoId);
        res.status(200).json(invitados);
    } catch (error) {
        responderError(res, error);
    }
};

module.exports = { crear, listar };