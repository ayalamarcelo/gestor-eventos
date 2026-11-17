const express = require('express');
const eventRouter = require(`./routers/eventRouter`);
const invitacionRouter = require('./routers/invitacionRouter')
const confirmationRouter = require('./routers/confirmationRouter');
const guestRouter = require('./routers/guestRouter');

const { PORT, HOSTNAME } = require('./database/config');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200']
}));
app.use(express.json());

app.use('/api', eventRouter);
app.use('/api', confirmationRouter);
app.use('/api', guestRouter);
app.use('/api/invitaciones', invitacionRouter)

app.get('/', (req, res) => {
   res.status(200).send('OK');
});


app.listen(PORT, HOSTNAME, () => {
  console.log(`Servidor corriendo en puerto: http://${HOSTNAME}:${PORT}`);
});
