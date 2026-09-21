import app from "./app.js";
import pool, { checkDatabaseConnection } from "./config/database.js";
import { getAuthConfig } from "./config/auth.js";

try {
    getAuthConfig();
    await checkDatabaseConnection();
    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Banco conectado. Servidor ligado na porta ${server.address().port}!`);
    });
    server.on('error', async (error) => {
        console.error('Não foi possível iniciar o servidor:', error.code || 'UNKNOWN');
        await pool.end();
        process.exitCode = 1;
    });
    let shuttingDown = false;
    const shutdown = () => {
        if (shuttingDown) return;
        shuttingDown = true;
        const timeout = setTimeout(() => process.exit(1), 15000);
        timeout.unref();
        server.close(async () => {
            await pool.end();
            clearTimeout(timeout);
        });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
} catch (error) {
    console.error('Servidor não iniciado: falha na configuração ou conexão com o banco.', error.code || error.message);
    await pool.end();
    process.exitCode = 1;
}
