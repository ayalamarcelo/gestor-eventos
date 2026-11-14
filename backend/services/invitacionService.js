const invitacionesRepository = require('../repositories/invitacionRepository')

const RESTRICCIONES = ['ninguna', 'vegetariano', 'celiaco', 'alergia', 'otra']

const crearError = (status, message) => {
    const error = new Error(message)
    error.status = status
    return error
}

const validarDatos = (body) => {
    const datos = body || {}

    const asiste = datos.asiste
    if (typeof asiste !== 'boolean') {
        throw crearError(400, 'asiste es obligatorio y debe ser verdadero o falso')
    }

    const cantidad = datos.cantidad_acompanantes ?? 0
    if (!Number.isInteger(cantidad) || cantidad < 0) {
        throw crearError(400, 'cantidad_acompanantes debe ser un entero mayor o igual a 0')
    }

    const restriccion = datos.restriccion ?? 'ninguna'
    if (!RESTRICCIONES.includes(restriccion)) {
        throw crearError(400, `restriccion debe ser una de: ${RESTRICCIONES.join(', ')}`)
    }

    let detalle = datos.detalle_restriccion ?? null
    if (detalle !== null) {
        if (typeof detalle !== 'string') {
            throw crearError(400, 'detalle_restriccion debe ser texto')
        }
        detalle = detalle.trim() || null
        if (detalle !== null && detalle.length > 200) {
            throw crearError(400, 'detalle_restriccion no puede superar los 200 caracteres')
        }
    }

    if (!asiste && (cantidad !== 0 || restriccion !== 'ninguna' || detalle !== null)) {
        throw crearError(400, 'Si no asiste, cantidad_acompanantes debe ser 0, restriccion "ninguna" y sin detalle')
    }

    return { asiste, cantidad_acompanantes: cantidad, restriccion, detalle_restriccion: detalle }
}

const confirmarAsistencia = async (codigo, body) => {
    const datos = validarDatos(body)

    const invitacion = await invitacionesRepository.buscarInvitacionPorCodigo(codigo)
    if (!invitacion) throw crearError(404, 'Invitacion no encontrada')
    if (invitacion.confirmacion_id !== null) {
        throw crearError(409, 'Este invitado ya confirmó su asistencia')
    }

    return invitacionesRepository.insertarConfirmacion(invitacion.invitado_id, datos)
}

const obtenerInvitacion = async (codigo) => {
    const datosInvitacion = await invitacionesRepository.buscarInvitacionPorCodigo(codigo)

    if (!datosInvitacion) return null

    return {
        invitado_id: datosInvitacion.invitado_id,
        nombre_invitado: datosInvitacion.nombre_invitado,
        codigo: datosInvitacion.codigo_invitado,
        ya_confirmo: datosInvitacion.confirmacion_id !== null,
        evento: {
            id: datosInvitacion.evento_id,
            titulo: datosInvitacion.titulo,
            descripcion: datosInvitacion.descripcion,
            fecha_hora: datosInvitacion.fecha_hora,
            direccion: datosInvitacion.direccion,
        },

    }

}

module.exports = { obtenerInvitacion, confirmarAsistencia }