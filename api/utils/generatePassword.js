import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
const password = process.env.GENERATED_PASSWORD;
if (!password || Buffer.byteLength(password, 'utf8') > 72) {
    console.error('Defina GENERATED_PASSWORD com uma senha de até 72 bytes no ambiente local.');
    process.exit(1);
}

bcrypt.hash(password, 10)
    .then(hash => {
        console.log(hash);
    })
    .catch(error => {
        console.error('Não foi possível gerar o hash:', error.code || 'HASH_ERROR');
        process.exitCode = 1;
    });
