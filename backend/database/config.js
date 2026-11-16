const dotenv = require(`dotenv`)

dotenv.config();

const organizadorId = Number(process.env.ORGANIZADOR_ID);
const PORT = Number(process.env.PORT) || 3008;
const HOSTNAME = process.env.HOST || '127.0.0.1';

if (!Number.isInteger(organizadorId)) {
  throw new Error('ORGANIZADOR_ID debe ser un número entero en el .env');
}

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE
  }
};

module.exports = {config, organizadorId, PORT, HOSTNAME}