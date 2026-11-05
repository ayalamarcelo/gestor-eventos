const getAll = async () => {
  // Estos son datos inventados chicos, cuando tengamos el sql, esto se cambia
  return [
    { id: 1, nombre: 'Recital de prueba' },
    { id: 2, nombre: 'Feria de comida' }
  ];
};

module.exports = { getAll };