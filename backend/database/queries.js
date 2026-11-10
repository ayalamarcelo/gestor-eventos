module.exports = {
  getEventos: `SELECT id, titulo, descripcion, fecha_hora, direccion, codigo, creado_en, organizador_id
               FROM Eventos`,
  buscarInvitacionPorCodigo: `
              SELECT
                  i.id          AS invitado_id,
                  i.nombre      AS nombre_invitado,
                  i.codigo      AS codigo_invitado,
                  e.id          AS evento_id,
                  e.titulo,
                  e.descripcion,
                  e.fecha_hora,
                  e.direccion,
                  c.id          AS confirmacion_id
              FROM Invitados i
              INNER JOIN Eventos e ON e.id = i.evento_id
              LEFT JOIN Confirmaciones c ON c.invitado_id = i.id
              WHERE i.codigo = @codigo
  `
};