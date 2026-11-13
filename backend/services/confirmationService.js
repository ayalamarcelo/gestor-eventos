const confirmationRepository = require('../repositories/confirmationRepository');

const RESTRICCIONES = ['ninguna', 'vegetariano', 'celiaco', 'alergia', 'otra'];

const crearError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const validarCodigo = (codigo) => {
    const limpio = typeof codigo === 'string' ? codigo.trim() : '';
    if (limpio.length === 0 || limpio.length > 12) {
        throw crearError(400, 'El código del invitado no es válido');
    }
    return limpio;
};

const validarId = (valor, nombre) => {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) {
        throw crearError(400, `${nombre} debe ser un número entero positivo`);
    }
    return numero;
};

const validarDatos = (body) => {
    const datos = body || {};

    const asiste = datos.asiste;
    if (typeof asiste !== 'boolean') {
        throw crearError(400, 'asiste es obligatorio y debe ser verdadero o falso');
    }

    const cantidad = datos.cantidad_acompanantes ?? 0;
    if (!Number.isInteger(cantidad) || cantidad < 0) {
        throw crearError(400, 'cantidad_acompanantes debe ser un entero mayor o igual a 0');
    }

    const restriccion = datos.restriccion ?? 'ninguna';
    if (!RESTRICCIONES.includes(restriccion)) {
        throw crearError(400, `restriccion debe ser una de: ${RESTRICCIONES.join(', ')}`);
    }

    let detalle = datos.detalle_restriccion ?? null;
    if (detalle !== null) {
        if (typeof detalle !== 'string') {
            throw crearError(400, 'detalle_restriccion debe ser texto');
        }
        detalle = detalle.trim() || null;
        if (detalle !== null && detalle.length > 200) {
            throw crearError(400, 'detalle_restriccion no puede superar los 200 caracteres');
        }
    }

    if (!asiste && (cantidad !== 0 || restriccion !== 'ninguna' || detalle !== null)) {
        throw crearError(
            400,
            'Si no asiste, cantidad_acompanantes debe ser 0, restriccion "ninguna" y sin detalle'
        );
    }

    return {
        asiste,
        cantidad_acompanantes: cantidad,
        restriccion,
        detalle_restriccion: detalle
    };
};

const errorSinConfirmacion = async (codigo) => {
    const existe = await confirmationRepository.existeInvitado(codigo);
    return crearError(404, existe ? 'Todavía no confirmó' : 'Invitado no encontrado');
};

const getByCodigo = async (codigoCrudo) => {
    const codigo = validarCodigo(codigoCrudo);
    const confirmacion = await confirmationRepository.getByCodigo(codigo);
    if (!confirmacion) throw await errorSinConfirmacion(codigo);
    return confirmacion;
};

const updateByCodigo = async (codigoCrudo, body) => {
    const codigo = validarCodigo(codigoCrudo);
    const datos = validarDatos(body);
    const filas = await confirmationRepository.updateByCodigo(codigo, datos);
    if (filas === 0) throw await errorSinConfirmacion(codigo);
    return confirmationRepository.getByCodigo(codigo);
};

const updateByInvitado = async (eventoIdCrudo, invitadoIdCrudo, organizadorId, body) => {
    const eventoId = validarId(eventoIdCrudo, 'eventoId');
    const invitadoId = validarId(invitadoIdCrudo, 'invitadoId');
    const datos = validarDatos(body);
    const filas = await confirmationRepository.updateByInvitado(
        eventoId, invitadoId, organizadorId, datos
    );
    if (filas === 0) throw crearError(404, 'Confirmación no encontrada');
    return confirmationRepository.getByInvitado(eventoId, invitadoId, organizadorId);
};

const removeByInvitado = async (eventoIdCrudo, invitadoIdCrudo, organizadorId) => {
    const eventoId = validarId(eventoIdCrudo, 'eventoId');
    const invitadoId = validarId(invitadoIdCrudo, 'invitadoId');
    const filas = await confirmationRepository.removeByInvitado(
        eventoId, invitadoId, organizadorId
    );
    if (filas === 0) throw crearError(404, 'Confirmación no encontrada');
};

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
    getByCodigo,
    updateByCodigo,
    updateByInvitado,
    removeByInvitado,
    obtenerReporteConfirmaciones
};
