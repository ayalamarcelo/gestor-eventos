const queryBaseSelect = `SELECT id, 
titulo,
descripcion, 
fecha_hora, 
direccion, 
codigo,
creado_en, 
organizador_id
FROM Eventos`;


module.exports = {
  getEventos: queryBaseSelect,
  getEventById: `${queryBaseSelect} WHERE id = @id `,
  deleteEventById: `DELETE FROM Eventos WHERE id = @id `
};