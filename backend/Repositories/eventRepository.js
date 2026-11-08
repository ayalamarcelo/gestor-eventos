const {getSQLConnection} = require(`../database/connection`)
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

module.exports = { getAll };