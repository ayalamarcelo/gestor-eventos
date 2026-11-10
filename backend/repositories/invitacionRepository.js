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

module.exports = { buscarInvitacionPorCodigo }