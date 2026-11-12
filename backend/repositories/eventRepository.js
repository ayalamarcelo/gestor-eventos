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
    try {
        const pool = await getSQLConnection();
        const resultado = await pool.request()
        .input('id', sql.Int, id)
        .query(queries.getEventById);
        return resultado.recordset[0];
    }
    catch (error) {
        throw new Error('Error en eventRepository.getEventById: ' + error.message);
    }
}
const deleteEventById = async (id) => {
    try {
        const pool = await getSQLConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.deleteEventById);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error en eventRepository.deleteEventById: ' + error.message);
    }
}

const updateEventById = async (id, evento) => {
    try {
        const pool = await getSQLConnection();
        const request = pool.request();
        request.input('id', sql.Int, id);

        const campos = [];

        if (evento.titulo !== undefined) {
            request.input('titulo', sql.NVarChar(120), evento.titulo);
            campos.push('titulo = @titulo');
        }
        if (evento.descripcion !== undefined) {
            request.input('descripcion', sql.NVarChar(500), evento.descripcion);
            campos.push('descripcion = @descripcion');
        }
        if (evento.fecha_hora !== undefined) {
            request.input('fecha_hora', sql.DateTime2, evento.fecha_hora);
            campos.push('fecha_hora = @fecha_hora');
        }
        if (evento.direccion !== undefined) {
            request.input('direccion', sql.NVarChar(200), evento.direccion);
            campos.push('direccion = @direccion');
        }

        const resultado = await request.query(queries.updateEventById(campos));
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error en eventRepository.updateEventById: ' + error.message);
    }
};
module.exports = { getAll, getEventById, deleteEventById, updateEventById };