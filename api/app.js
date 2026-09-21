import express from "express";
import cors from "cors";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importando rotas
import adminRoutes from "./routes/admin/admin.js";
import authenticateAdmin from "./middlewares/authMiddleware.js";
import publicRoutes, { sendNotFound } from "./routes/public/static/public.js";
import authRoutes from "./routes/auth/auth.js";

// Instanciando servidor express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "16kb" }));

// Rotas
// Arquivos históricos preservados por solicitação não fazem parte do site publicado.
app.get(['/parts.html', '/product2.html'], sendNotFound);
app.get('/index.html', (req, res) => res.redirect(301, '/'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", publicRoutes);
app.use("/auth", authRoutes);

app.use("/admin", authenticateAdmin, adminRoutes);

// Não entregar HTML para endpoints ou arquivos inexistentes.
app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html') && !path.extname(req.path) &&
        !/^\/(auth|admin|app-assets|assets|css|js|fonts)(\/|$)/.test(req.path)) {
        return sendNotFound(req, res, next);
    }
    res.status(404).json({ error: 'Recurso não encontrado' });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ error: "JSON inválido" });
    }
    if (error.type === "entity.too.large") {
        return res.status(413).json({ error: "Corpo da requisição muito grande" });
    }
    console.error("Erro interno da API:", error.code || "INTERNAL_ERROR");
    return res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
