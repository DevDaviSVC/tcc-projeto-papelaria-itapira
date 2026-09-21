import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

export function getAuthConfig() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.trim().length < 32 || secret.startsWith("replace-with-")) {
        throw new Error("JWT_SECRET deve conter pelo menos 32 caracteres e não pode ser o valor de exemplo.");
    }
    // Compatibilidade com a configuração anterior do projeto.
    const duration = process.env.JWT_EXPIRES_IN ?? process.env.JWT_EXPIRES ?? "1h";
    const expiresIn = /^\d+$/.test(duration) ? Number(duration) : duration;
    const config = {
        secret,
        expiresIn,
        algorithm: "HS256",
        issuer: "papelaria-itapira-api",
        audience: "papelaria-itapira-admin",
    };
    try {
        const payload = jwt.decode(jwt.sign({}, secret, { expiresIn }));
        if (!Number.isFinite(payload.exp) || payload.exp <= payload.iat) throw new Error();
    } catch {
        throw new Error("JWT_EXPIRES_IN deve ser uma duração positiva, como 1h, ou segundos inteiros.");
    }
    return config;
}
