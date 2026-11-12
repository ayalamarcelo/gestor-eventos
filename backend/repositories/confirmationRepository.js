const sql = require('mssql');
const { getSQLConnection } = require('../database/connection');
const queries = require('../database/queries');
const { get } = require('../routers/confirmationRouter');

const ejecutar = async (nombre, callback) => {
    try {
        const pool = await getSQLConnection();
        return await callback(pool.request());
    } catch (error) {
        throw new Error(`Error en confirmationRepository.${nombre}: ${error.message}`);
    }
};

const conDatos = (request, datos) =>
    request
        .input('asiste', sql.Bit, datos.asiste)
        .input('acompanantes', sql.Int, datos.cantidad_acompanantes)
        .input('restriccion', sql.VarChar(20), datos.restriccion)
        .input('detalle', sql.NVarChar(200), datos.detalle_restriccion);

const existeInvitado = (codigo) =>
    ejecutar('existeInvitado', async (request) => {
        const resultado = await request
            .input('codigo', sql.VarChar(12), codigo)
            .query(queries.buscarInvitado);
        return resultado.recordset.length > 0;
    });

const getByCodigo = (codigo) =>
    ejecutar('getByCodigo', async (request) => {
        const resultado = await request
            .input('codigo', sql.VarChar(12), codigo)
            .query(queries.getConfirmacionPorCodigo);
        return resultado.recordset[0] || null;
    });

const updateByCodigo = (codigo, datos) =>
    ejecutar('updateByCodigo', async (request) => {
        const resultado = await conDatos(request, datos)
            .input('codigo', sql.VarChar(12), codigo)
            .query(queries.updateConfirmacionPorCodigo);
        return resultado.rowsAffected[0];
    });

const getByInvitado = (eventoId, invitadoId, organizadorId) =>
    ejecutar('getByInvitado', async (request) => {
        const r = await conOrganizador(request, eventoId, invitadoId, organizadorId)
            .query(queries.getConfirmacionDeEvento);
        return r.recordset[0] || null;
    });

const updateByInvitado = (eventoId, invitadoId, organizadorId, datos) =>
    ejecutar('updateByInvitado', async (request) => {
        const r = await conDatos(
            conOrganizador(request, eventoId, invitadoId, organizadorId),
            datos
        ).query(queries.updateConfirmacionDeEvento);
        return r.rowsAffected[0];
    });

const removeByInvitado = (eventoId, invitadoId, organizadorId) =>
    ejecutar('removeByInvitado', async (request) => {
        const r = await conOrganizador(request, eventoId, invitadoId, organizadorId)
            .query(queries.deleteConfirmacionDeEvento);
        return r.rowsAffected[0];
    });
    
module.exports = {
    existeInvitado,
    getByCodigo,
    updateByCodigo,
    getByInvitado,
    updateByInvitado,
    removeByInvitado
};