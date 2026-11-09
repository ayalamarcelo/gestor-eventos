const {getSQLConnection} = require(`../database/connection`)
const sql = require('mssql')
const queries = require(`../database/queries`)

const getAll = async () => {
    try{
        const pool = await getSQLConnection();
        const resultado = await pool.request().query(queries.getEventos);
        return resultado.recordset;
    }
    catch(error) {
        throw new Error('Error en eventRepository.getAll: ' + error.message);
    }
};

const getEventById = async (id) => {
    const pool = await getSQLConnection();
    try {
        const resultado = await pool.request()
        .input('id', sql.Int, id)
        .query(queries.getEventById);
        return resultado.recordset;
    }
    catch (error) {
        throw new Error('Error en eventRepository.getEvent: ' + error.message);
    }
}
module.exports = { getAll, getEventById };