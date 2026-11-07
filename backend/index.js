const express = require('express');
const eventRouter = require(`./Routers/eventRouter`)
const HOSTNAME = '127.0.0.1';
const PORT = 3008;
const app = express();

app.use(express.json());
app.use('/api', eventRouter);

app.get('/', (req, res) => {
   res.status(200).send('OK');
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor corriendo en puerto: http://${HOSTNAME}:${PORT}`);
});
