const express = require('express');
const eventRouter = require(`./routers/eventRouter`)
const confirmationRouter = require('./routers/confirmationRouter');
const { PORT, HOSTNAME } = require('./database/config');
const app = express();

app.use(express.json());
app.use('/api', eventRouter);
app.use('/api', confirmationRouter);

app.get('/', (req, res) => {
   res.status(200).send('OK');
});


app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor corriendo en puerto: http://${HOSTNAME}:${PORT}`);
});
