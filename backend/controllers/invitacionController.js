const invitacionService = require('../services/invitacionService')

const responderError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error interno del servidor' })
}

const obtenerInvitacionPorCodigo = async (req, res) => {
    try {
        const codigo = (req.params.codigo || '').trim() 
        const invitacion = await invitacionService.obtenerInvitacion(codigo)

        if(!invitacion){
            return res.status(404).json({error: 'Invitacion no encontrada'})
        }

        return res.status(200).json(invitacion)

    } catch (error) {
         responderError(res, error)
    }
}

const confirmarAsistencia = async (req, res) => {
    try {
        const codigo = (req.params.codigo || '').trim()
        const confirmacion = await invitacionService.confirmarAsistencia(codigo, req.body)

        return res.status(201).json(confirmacion)

    } catch (error) {
         responderError(res, error)
    }
}

module.exports = { obtenerInvitacionPorCodigo, confirmarAsistencia }