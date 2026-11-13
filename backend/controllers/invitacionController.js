const invitacionService = require('../services/invitacionService')

const obtenerInvitacionPorCodigo = async (req, res) => {
    try {
        const codigo = (req.params.codigo || '').trim() 
        const invitacion = await invitacionService.obtenerInvitacion(codigo)

        if(!invitacion){
            return res.status(404).json({error: 'Invitacion no encontrada'})
        }

        return res.status(200).json(invitacion)

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

module.exports = { obtenerInvitacionPorCodigo }