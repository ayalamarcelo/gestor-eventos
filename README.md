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

**The Gathering** permite que un organizador cree un evento, cargue a sus invitados y le dé a cada uno un link personal, para ver después quién confirmó, con sus acompañantes y restricciones alimentarias.

### Organizador
- Crea, edita y elimina **solo sus propios eventos**.
- Carga la **lista de invitados** de cada evento. Cada invitado recibe un **código único**, un **link personal**, un **código QR** y un botón para enviarlo por **WhatsApp** (o copiar el link).
- Puede **eliminar la invitación** de un invitado.
- Ve un **panel** con las confirmaciones, la cantidad por restricción alimentaria y una tabla de invitados filtrable.

### Invitado (sin cuenta)
- Abre su link personal y ve la **tarjeta de invitación** del evento.
- Confirma o rechaza su asistencia indicando acompañantes y restricción alimentaria (ninguna, vegetariano, celíaco, alergia u otra).
- Puede **modificar** su respuesta desde el mismo link.

### Fuera del MVP
Registro e inicio de sesión, recuperación de contraseña, roles de usuario, plantillas visuales, galería de fotos, trivias, votaciones, sincronización con calendarios y pagos.

> Como no hay login, el backend usa un **organizador de prueba** (`ORGANIZADOR_ID` en el `.env`): todos los eventos pertenecen a ese usuario.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Angular 22 + Bootstrap, librería `qrcode` para los QR |
| Backend | Node.js 22 + Express 5 |
| Base de datos | SQL Server (paquete `mssql`) |

## Estructura del repositorio

```
gestor-eventos/
├── backend/
│   ├── index.js          # Servidor Express y registro de rutas
│   ├── routers/          # Rutas y métodos HTTP
│   ├── controllers/      # Leen la petición y arman la respuesta
│   ├── services/         # Reglas de negocio y validaciones
│   ├── repositories/     # Acceso a datos (SQL)
│   ├── database/         # Configuración, conexión y queries
│   ├── postman/          # Colección de Postman con todas las rutas
│   └── sql/schema.sql    # Tablas y datos de ejemplo
└── frontend/             # App Angular
    └── src/app/
        ├── components/   # Pantallas: lista de eventos, detalle, invitados
        ├── services/     # Llamadas HTTP a la API
        └── models/       # Forma de los datos
```

Cada recurso del backend sigue las capas **Router → Controller → Service → Repository**.

## Requisitos previos

- [Node.js](https://nodejs.org/) **22 o superior** (incluye `npm`). Con Node 20 el backend no puede conectarse a SQL Server.
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (o una instalación local de SQL Server)

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPO>
cd gestor-eventos
```

### 2. Base de datos (SQL Server)

**Opción A: SQL Server con Docker (recomendado)**

Abrir Docker Desktop y esperar a que el motor esté corriendo. Crear el contenedor, usando en `MSSQL_SA_PASSWORD` la misma contraseña que va en `DB_PASSWORD` del `.env` (mínimo 8 caracteres, con mayúsculas, minúsculas, números y símbolos):

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=TU_PASSWORD" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

Crear la base de datos (el nombre tiene que coincidir con `DB_NAME` del `.env`):

```bash
docker exec sqlserver bash -c '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "CREATE DATABASE [TheGathering]"'
```

Cargar el script, desde la raíz del proyecto:

```bash
docker cp backend/sql/schema.sql sqlserver:/tmp/schema.sql
```

```bash
docker exec sqlserver bash -c '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d TheGathering -i /tmp/schema.sql'
```

**Opción B: instalación local de SQL Server**

1. Conectarse con [Azure Data Studio](https://learn.microsoft.com/azure-data-studio/) o SSMS.
2. Crear una base de datos llamada `TheGathering` (o el nombre que pongas en `DB_NAME`).
3. Abrir [`backend/sql/schema.sql`](backend/sql/schema.sql) y ejecutarlo sobre esa base.

**Qué crea el script**

Las tablas `Usuarios`, `Eventos`, `Invitados` y `Confirmaciones`, con datos de ejemplo: un organizador, un evento ("Cena de Fin de Cursada"), seis invitados (`INV-MAT001`, `INV-MAR002`, `INV-GIS003`, `INV-SOL004`, `INV-SEB005` e `INV-GEN006`) y cinco confirmaciones. `INV-GEN006` queda pendiente.

> ⚠️ El script **borra y recrea** las tablas (`DROP TABLE IF EXISTS`). Sirve para volver a los datos de ejemplo.

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Completar el `.env` (este archivo nunca se sube al repo):

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (por defecto `3008`) |
| `HOST` | Host del servidor (por defecto `127.0.0.1`) |
| `DB_SERVER` | Host de SQL Server (ej. `localhost`) |
| `DB_INSTANCE` | Instancia con nombre (ej. `SQLEXPRESS`); dejar vacío con Docker |
| `DB_NAME` | Nombre de la base (ej. `TheGathering`) |
| `DB_USER` / `DB_PASSWORD` | Credenciales de SQL Server (con Docker, usuario `sa`) |
| `ORGANIZADOR_ID` | **Obligatoria.** Id del organizador de prueba (`1` con los datos de ejemplo). |

Iniciar el servidor (se reinicia al guardar cambios):

```bash
npm start
```

Verificacion de funcionamiento:
- <http://127.0.0.1:3008/> debe responder `OK`.
- <http://127.0.0.1:3008/api/eventos> debe listar el evento de ejemplo (confirma la conexión con la base).

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start -- --host 127.0.0.1
```

Abrir **<http://127.0.0.1:4200/>**.

> Usar `127.0.0.1` y **no** `localhost`: el backend solo permite pedidos desde `http://127.0.0.1:4200` (CORS). Con `localhost` la app carga pero no trae datos.


## Resumen rápido

| Qué | Comando | URL |
|-----|---------|-----|
| Base de datos | `docker start sqlserver` | `localhost:1433` |
| Backend | `cd backend && npm start` | http://127.0.0.1:3008 |
| Frontend | `cd frontend && npm start -- --host 127.0.0.1` | http://127.0.0.1:4200 |

## API

Todas las rutas cuelgan de `/api`. No hay autenticación: las rutas del organizador usan el usuario de prueba. Los errores devuelven `{ "error": "mensaje" }` con el código HTTP correspondiente.

### Eventos (organizador)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/eventos` | Lista los eventos |
| POST | `/api/eventos` | Crea un evento |
| GET | `/api/eventos/:id` | Devuelve un evento |
| PUT | `/api/eventos/:id` | Edita un evento (parcial) |
| DELETE | `/api/eventos/:id` | Elimina un evento, con sus invitados y confirmaciones |

### Invitados (organizador)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/eventos/:eventoId/invitados` | Lista los invitados del evento |
| POST | `/api/eventos/:eventoId/invitados` | Crea un invitado (`{ "nombre": "..." }`) y genera su código |
| DELETE | `/api/eventos/:eventoId/invitados/:invitadoId` | Elimina un invitado y su confirmación |

### Invitación y confirmación (invitado, con su código)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/invitaciones/:codigo` | Datos del evento e indicador `ya_confirmo` para la tarjeta |
| POST | `/api/invitaciones/:codigo/confirmacion` | Confirma o rechaza la asistencia |
| GET | `/api/invitados/:codigo/confirmacion` | Devuelve su confirmación |
| PUT | `/api/invitados/:codigo/confirmacion` | Modifica su confirmación |

### Confirmaciones (organizador)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/eventos/:eventoId/confirmaciones` | Lista de confirmaciones (filtro `?restriccion=`) |
| PUT | `/api/eventos/:eventoId/invitados/:invitadoId/confirmacion` | Modifica la confirmación de un invitado |
| DELETE | `/api/eventos/:eventoId/invitados/:invitadoId/confirmacion` | Borra la confirmación (el invitado vuelve a pendiente) |

### Colección de Postman

En [`backend/postman`](backend/postman) hay una colección con todas las rutas y sus pruebas automáticas. Importarla en Postman (Import → arrastrar el archivo) con el backend y la base levantados. Algunas requests modifican los datos de ejemplo.

