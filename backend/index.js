const express = require('express');
const HOSTNAME = '127.0.0.1';
const PORT = 3008;
const app = express();

app.get('/', (req, res) => {
   res.status(200).send('OK');
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor corriendo en puerto: http://${HOSTNAME}:${PORT}`);
});
