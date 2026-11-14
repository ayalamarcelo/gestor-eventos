const sql = require('mssql')
const { getSQLConnection } = require('../database/connection')
const consulta = require('../database/queries')

const buscarInvitacionPorCodigo = async (codigo) => {
    try {
        const pool = await getSQLConnection()
        const resultado = await pool
            .request()
            .input('codigo', sql.VarChar, codigo)
            .query(consulta.buscarInvitacionPorCodigo);
    
        return resultado.recordset[0] || null;
        
    } catch (error) {
        throw new Error('Error en invitacionRepository.buscarInvitacionPorCodigo: ' + error.message)
    }
}

const insertarConfirmacion = async (invitadoId, datos) => {
    try {
        const pool = await getSQLConnection()
        const resultado = await pool
            .request()
            .input('invitado_id', sql.Int, invitadoId)
            .input('asiste', sql.Bit, datos.asiste)
            .input('acompanantes', sql.Int, datos.cantidad_acompanantes)
            .input('restriccion', sql.VarChar(20), datos.restriccion)
            .input('detalle', sql.NVarChar(200), datos.detalle_restriccion)
            .query(consulta.postInsertarConfirmacion)

        return resultado.recordset[0]

    } catch (error) {
        // 2627 = violación de UNIQUE: dos confirmaciones simultáneas del mismo invitado
        if (error.number === 2627) {
            const duplicado = new Error('Este invitado ya confirmó su asistencia')
            duplicado.status = 409
            throw duplicado
        }
        throw new Error('Error en invitacionRepository.insertarConfirmacion: ' + error.message)
    }
}

module.exports = { buscarInvitacionPorCodigo, insertarConfirmacion }