    const {config} = require(`./config.js`)
    const sql = require(`mssql`)

    exports.getSQLConnection = async () => {
        try {
            const pool = await sql.connect(config)
            return pool
        }
        catch(error) {
            throw new Error('No se pudo conectar a la base de datos: ' + error.message);
        }
    }