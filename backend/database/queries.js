module.exports = {
  getEventos: `SELECT id, titulo, descripcion, fecha_hora, direccion, codigo, creado_en, organizador_id
               FROM Eventos`,
  buscarInvitado: `SELECT id FROM Invitados WHERE codigo = @codigo`,
  getConfirmacionPorCodigo: `
    SELECT c.id, i.id AS invitado_id, i.codigo, i.nombre, c.asiste,
           c.cantidad_acompanantes, c.restriccion, c.detalle_restriccion, c.creado_en
    FROM Confirmaciones c
    JOIN Invitados i ON i.id = c.invitado_id
    WHERE i.codigo = @codigo`,
  updateConfirmacionPorCodigo: `
    UPDATE c
    SET asiste = @asiste,
        cantidad_acompanantes = @acompanantes,
        restriccion = @restriccion,
        detalle_restriccion = @detalle
    FROM Confirmaciones c
    JOIN Invitados i ON i.id = c.invitado_id
    WHERE i.codigo = @codigo`,
  getConfirmacionDeEvento: `
    SELECT c.id, i.id AS invitado_id, i.codigo, i.nombre, c.asiste,
           c.cantidad_acompanantes, c.restriccion, c.detalle_restriccion, c.creado_en
    FROM Confirmaciones c
    JOIN Invitados i ON i.id = c.invitado_id
    JOIN Eventos e ON e.id = i.evento_id
    WHERE i.id = @invitadoId AND i.evento_id = @eventoId
      AND e.organizador_id = @organizadorId`,
  updateConfirmacionDeEvento: `
    UPDATE c
    SET asiste = @asiste,
        cantidad_acompanantes = @acompanantes,
        restriccion = @restriccion,
        detalle_restriccion = @detalle
    FROM Confirmaciones c
    JOIN Invitados i ON i.id = c.invitado_id
    JOIN Eventos e ON e.id = i.evento_id
    WHERE i.id = @invitadoId AND i.evento_id = @eventoId
      AND e.organizador_id = @organizadorId`,
  deleteConfirmacionDeEvento: `
    DELETE c
    FROM Confirmaciones c
    JOIN Invitados i ON i.id = c.invitado_id
    JOIN Eventos e ON e.id = i.evento_id
    WHERE i.id = @invitadoId AND i.evento_id = @eventoId
      AND e.organizador_id = @organizadorId`,
  
};