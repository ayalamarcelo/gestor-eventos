module.exports = {
  getEventos: `SELECT id, titulo, descripcion, fecha_hora, direccion, codigo, creado_en, organizador_id
               FROM Eventos`,

  getEventById: `SELECT * FROM Eventos WHERE id = @id `
};