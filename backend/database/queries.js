const queryBaseSelect = `SELECT id, 
titulo,
descripcion, 
fecha_hora, 
direccion,
creado_en, 
organizador_id
FROM Eventos`;

module.exports = {
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
              WHERE i.codigo = @codigo`,
  postInsertarConfirmacion: `
              INSERT INTO Confirmaciones
                  (invitado_id, asiste, cantidad_acompanantes, restriccion, detalle_restriccion)
              OUTPUT INSERTED.id, INSERTED.invitado_id, INSERTED.asiste,
                     INSERTED.cantidad_acompanantes, INSERTED.restriccion,
                     INSERTED.detalle_restriccion, INSERTED.creado_en
              VALUES
                  (@invitado_id, @asiste, @acompanantes, @restriccion, @detalle)
  `,
  getEventos: queryBaseSelect,
  getEventById: `${queryBaseSelect} WHERE id = @id `,
  deleteEventById: `DELETE FROM Eventos WHERE id = @id `,
  updateEventById: (campos) => `UPDATE Eventos SET ${campos.join(', ')} WHERE id = @id`,
  createEvent: `INSERT INTO Eventos (titulo, descripcion, fecha_hora, direccion, organizador_id)
               OUTPUT INSERTED.id, INSERTED.titulo, INSERTED.descripcion,
                      INSERTED.fecha_hora, INSERTED.direccion,
                      INSERTED.creado_en, INSERTED.organizador_id
               VALUES (@titulo, @descripcion, @fecha_hora, @direccion, @organizador_id)`
};