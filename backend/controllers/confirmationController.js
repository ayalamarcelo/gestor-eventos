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

const updateByInvitado = async (req, res) => {
    try {
        const confirmacion = await confirmationService.updateByInvitado(
            req.params.eventoId,
            req.params.invitadoId,
            organizadorId,
            req.body
        );
        res.status(200).json(confirmacion);
    } catch (error) {
        responderError(res, error);
    }
};

const removeByInvitado = async (req, res) => {
    try {
        await confirmationService.removeByInvitado(
            req.params.eventoId,
            req.params.invitadoId,
            organizadorId
        );
        res.status(204).send();
    } catch (error) {
        responderError(res, error);
    }
};

const obtenerReporte = async (req, res) => {
    try {
        const { eventoId } = req.params;
        const { restriccion } = req.query;
        const resultado = await confirmationService.obtenerReporteConfirmaciones(eventoId, restriccion);

        return res.status(200).json(resultado);
    } catch (error) {
        const codigoEstado = error.statusCode || 500;
        return res.status(codigoEstado).json({ error: error.message });
    }
};

module.exports = {
    getByCodigo,
    updateByCodigo,
    updateByInvitado,
    removeByInvitado,
    obtenerReporte
};
