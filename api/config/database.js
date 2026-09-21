import { Pool } from 'pg';
import dotenv from "dotenv";
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDirectory = fileURLToPath(new URL('../', import.meta.url));
dotenv.config({ path: path.join(apiDirectory, '.env'), quiet: true });

for (const key of ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']) {
    if (!process.env[key]?.trim()) {
        throw new Error(`Variável obrigatória ausente: ${key}`);
    }
}

const port = Number(process.env.DB_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT deve ser uma porta válida.');
}

const certificatePath = path.resolve(apiDirectory, process.env.DB_SSL_CA_PATH || '../prod-ca-2021.crt');
let certificate;
try {
    certificate = readFileSync(certificatePath, 'utf8');
} catch {
    throw new Error('Certificado SSL não encontrado ou ilegível. Verifique DB_SSL_CA_PATH (relativo à pasta api).');
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { ca: certificate, rejectUnauthorized: true },
    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    statement_timeout: 10000,
    query_timeout: 12000,
});

pool.on('error', (error) => {
    console.error('Erro em uma conexão ociosa com o banco:', error.code || 'UNKNOWN');
});

export async function checkDatabaseConnection() {
    await pool.query('SELECT 1');
}

export default pool;
