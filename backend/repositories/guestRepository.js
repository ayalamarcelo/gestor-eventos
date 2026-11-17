const sql = require('mssql');
const { getSQLConnection } = require('../database/connection');
const queries = require('../database/queries');
const { organizadorId } = require('../database/config');
const YA_EXISTE = 2627; 
const DUPLICADO = 2601; 

const eventoEsDelOrganizador = async (eventoId) => {
    try {
        const pool = await getSQLConnection();
        const resultado = await pool.request()
            .input('eventoId', sql.Int, eventoId)
            .input('organizadorId', sql.Int, organizadorId)
            .query(queries.eventoDelOrganizador);
        return resultado.recordset.length > 0;
    } catch (error) {
        throw new Error('Error al buscar si el evento es del organizador: ' + error.message);
    }
};

const insertar = async (eventoId, nombre, codigo) => {
    try {
        const pool = await getSQLConnection();
        const resultado = await pool.request()
            .input('eventoId', sql.Int, eventoId)
            .input('nombre', sql.NVarChar(100), nombre)
            .input('codigo', sql.VarChar(12), codigo)
            .query(queries.insertarInvitado);
        return resultado.recordset[0];
    } catch (error) {
        if (error.number === YA_EXISTE || error.number === DUPLICADO) {
            const duplicado = new Error('Código de invitado repetido');
            duplicado.codigoDuplicado = true;
            throw duplicado;
        }
        throw new Error('Error al insertar un invitado: ' + error.message);
    }
};

const listarPorEvento = async (eventoId) => {
    try {
        const pool = await getSQLConnection();
        const resultado = await pool.request()
            .input('eventoId', sql.Int, eventoId)
            .query(queries.getInvitadosDeEvento);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error en listarPorEvento: ' + error.message);
    }
};

const eliminar = async (eventoId, invitadoId) => {
    try {
        const pool = await getSQLConnection();
        const resultado = await pool.request()
            .input('eventoId', sql.Int, eventoId)
            .input('invitadoId', sql.Int, invitadoId)
            .query(queries.eliminarInvitado);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error al eliminar un invitado: ' + error.message);
    }
};

module.exports = { eventoEsDelOrganizador, insertar, listarPorEvento, eliminar };