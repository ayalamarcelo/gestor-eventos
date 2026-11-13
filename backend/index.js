const express = require('express');
const eventRouter = require(`./routers/eventRouter`);
const confirmacionRouter = require('./routers/confirmacionRouter');
const confirmationRouter = require('./routers/confirmationRouter');
const invitacionRouter = require('./routers/invitacionRouter')
const { PORT, HOSTNAME } = require('./database/config');
const app = express();

app.use(express.json());

app.use('/api', eventRouter);
app.use('/api', confirmacionRouter);
app.use('/api', confirmationRouter);
app.use('/api/invitaciones', invitacionRouter)

app.get('/', (req, res) => {
   res.status(200).send('OK');
});


app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor corriendo en puerto: http://${HOSTNAME}:${PORT}`);
});
