const express = require('express');
const eventRouter = require(`./routers/eventRouter`)
const { PORT, HOSTNAME } = require('./database/config');
const app = express();

app.use(express.json());
app.use('/api', eventRouter);

app.get('/', (req, res) => {
   res.status(200).send('OK');
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor corriendo en puerto: http://${HOSTNAME}:${PORT}`);
});
