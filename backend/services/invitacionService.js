const invitacionesRepository = require('../repositories/invitacionRepository')

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

module.exports = { obtenerInvitacion }