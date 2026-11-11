const { getSQLConnection } = require('../database/connection');
const sql = require('mssql');

const buscarEventoPorId = async (eventoId) => {
  const pool = await getSQLConnection();
  const resultado = await pool.request()
    .input('eventoId', sql.Int, eventoId)
    .query('SELECT * FROM Eventos WHERE id = @eventoId');
  
  return resultado.recordset[0];
};

const buscarConfirmaciones = async (eventoId, restriccion) => {
  const pool = await getSQLConnection();
  const request = pool.request().input('eventoId', sql.Int, eventoId);

  let consulta = 'SELECT * FROM Confirmaciones WHERE eventoId = @eventoId';

  if (restriccion) {
    consulta += ' AND restriccion = @restriccion';
    request.input('restriccion', sql.VarChar, restriccion);
  }

  const resultado = await request.query(consulta);
  return resultado.recordset;
};

module.exports = {
  buscarEventoPorId,
  buscarConfirmaciones
};