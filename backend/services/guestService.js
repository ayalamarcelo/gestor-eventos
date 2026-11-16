const crypto = require('crypto');
const guestRepository = require('../repositories/guestRepository');

const MAX_INTENTOS = 5;

const crearError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const validarId = (valor, nombre) => {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) {
        throw crearError(400, `${nombre} debe ser un número entero positivo`);
    }
    return numero;
};

const validarNombre = (body) => {
    const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
    if (nombre.length === 0 || nombre.length > 100) {
        throw crearError(400, 'nombre es obligatorio y no puede superar los 100 caracteres');
    }
    return nombre;
};

const generarCodigo = () => 'INV-' + crypto.randomBytes(4).toString('hex').toUpperCase();

const verificarEvento = async (eventoId) => {
    const esDelOrganizador = await guestRepository.eventoEsDelOrganizador(eventoId);
    if (!esDelOrganizador) throw crearError(404, 'Evento no encontrado');
};

const crear = async (eventoIdCrudo, body) => {
    const eventoId = validarId(eventoIdCrudo, 'eventoId');
    const nombre = validarNombre(body);
    await verificarEvento(eventoId);

    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        try {
            return await guestRepository.insertar(eventoId, nombre, generarCodigo());
        } catch (error) {
            if (!error.codigoDuplicado) throw error;
        }
    }
    throw crearError(500, 'No se pudo generar un código único, intentá de nuevo');
};

const listar = async (eventoIdCrudo) => {
    const eventoId = validarId(eventoIdCrudo, 'eventoId');
    await verificarEvento(eventoId);
    return guestRepository.listarPorEvento(eventoId);
};

module.exports = { crear, listar };