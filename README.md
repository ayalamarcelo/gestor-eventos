<h1 align="center">The Gathering</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/Status-In%20Development-green?style=for-the-badge" alt="Status" />
</p>

Esta aplicación web centraliza la creación, distribución y gestión de invitaciones digitales para eventos (cumpleaños, casamientos, reuniones), reemplazando los chats grupales y planillas dispersas por un panel de control ágil.

## ¿Qué hace la aplicación?

**The Gathering** permite que un organizador cree un evento, comparta un link único y vea cuántos invitados confirmaron, con sus acompañantes y restricciones alimentarias.

### Organizador
- Crea, edita y elimina **solo sus propios eventos**.
- Al guardar un evento obtiene el **link de invitación**, su **código QR** y un botón para compartirlo por **WhatsApp**.
- Ve un **panel** con totales (confirmados, no asisten, total de personas con acompañantes), cantidad por restricción alimentaria y una tabla de invitados filtrable.

### Invitado 
- Abre el link del evento y ve la **tarjeta de invitación**.
- Confirma o rechaza su asistencia indicando nombre, acompañantes y restricción alimentaria (ninguna, vegetariano, celíaco, alergia u otra).
- Puede **modificar o cancelar** su confirmación.

### Fuera del MVP
Recuperación de contraseña, roles de usuario, plantillas visuales, galería de fotos, trivias, votaciones, sincronización con calendarios y pagos.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Angular 22 |
| Backend | Node.js + Express 5 |
| Base de datos | SQL Server |
| Autenticación | JWT + bcrypt |

## Estructura del repositorio

```
gestor-eventos/
├── backend/
│   ├── index.js          # Servidor Express
│   ├── package.json
│   └── sql/schema.sql    # Tablas y datos de ejemplo
└── frontend/             # App Angular
    └── src/app/
```

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior (incluye `npm`)
- [Git](https://git-scm.com/)
- SQL Server (local, o en Docker — ver más abajo)
- Opcional: [Angular CLI](https://angular.dev/tools/cli) global (`npm i -g @angular/cli`); también funciona con `npx ng`.

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPO>
cd gestor-eventos
```

### 2. Base de datos (SQL Server)

**Opción A — SQL Server con Docker (recomendado, funciona en Mac/Windows/Linux):**

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=TuPassword_Segura123" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/azure-sql-edge
```

> En Macs con Apple Silicon usá `azure-sql-edge`. En Windows/Linux x64 también podés usar `mcr.microsoft.com/mssql/server:2022-latest`.

**Opción B — Instalación local** de SQL Server (Windows/Linux).

Luego creá la base y ejecutá el script. Con [Azure Data Studio](https://learn.microsoft.com/azure-data-studio/) o SSMS:

1. Conectate al servidor.
2. Creá una base de datos, por ejemplo `TheGathering`.
3. Abrí [`backend/sql/schema.sql`](backend/sql/schema.sql) y ejecutalo sobre esa base.

El script crea las tablas `Usuarios`, `Eventos` y `Confirmaciones` y carga datos de ejemplo (un organizador, el evento `GATHER2026` y cinco confirmaciones).

> ⚠️ El script **borra y recrea** las tablas (`DROP TABLE IF EXISTS`). No lo ejecutes sobre una base con datos que quieras conservar.

### 3. Backend

```bash
cd backend
npm install
```

Variables de entorno: copiá `.env.example` a `.env` y completá los valores (el archivo `.env` nunca se sube al repo).

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor |
| `DB_SERVER` | Host de SQL Server (ej. `localhost`) |
| `DB_PORT` | Puerto de SQL Server (por defecto `1433`) |
| `DB_NAME` | Nombre de la base (ej. `TheGathering`) |
| `DB_USER` / `DB_PASSWORD` | Credenciales de SQL Server |
| `JWT_SECRET` | Secreto para firmar los tokens JWT |


Iniciar el servidor:

```bash
# desarrollo (reinicia al guardar cambios)
npx nodemon index.js

# o normal
node index.js
```

Verificá que funciona abriendo <http://127.0.0.1:3008/> — debe responder `OK`.

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Abrí <http://localhost:4200/>. La app recarga automáticamente al modificar archivos.

Otros comandos útiles del frontend:

```bash
npm run build   # build de producción en frontend/dist
npm test        # tests con Vitest
```

## API (contrato del MVP)


| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/auth/me` | Usuario del token | Token |
| POST | `/api/eventos` | Crea un evento y genera su código | Token |
| GET | `/api/eventos` | Lista los eventos del usuario | Token |
| GET | `/api/eventos/:id` | Devuelve un evento propio | Token |
| PUT | `/api/eventos/:id` | Edita un evento propio | Token |
| DELETE | `/api/eventos/:id` | Elimina un evento propio | Token |
| GET | `/api/invitaciones/:codigo` | Datos públicos para la tarjeta | Público |
| POST | `/api/eventos/:id/confirmaciones` | El invitado confirma o rechaza | Público |
| GET | `/api/confirmaciones/:id` | Devuelve una confirmación | Público |
| PUT | `/api/confirmaciones/:id` | Modifica una confirmación | Público |
| DELETE | `/api/confirmaciones/:id` | Cancela una confirmación | Público |
| GET | `/api/eventos/:id/confirmaciones` | Lista de confirmaciones (filtro `?restriccion=`) | Token |
| GET | `/api/eventos/:id/resumen` | Totales y cantidad por restricción | Token |

Los errores devuelven `{ "error": "mensaje" }` con el código HTTP correspondiente.

## Flujo de trabajo con Git

- `main` siempre debe arrancar.
- Cada integrante trabaja en su rama `feature/...` con commits pequeños (`feat:`, `fix:`).
- Se integra a `develop` mediante Pull Request revisado por otra persona.
- Se integra a `main` el codigo funcional.
