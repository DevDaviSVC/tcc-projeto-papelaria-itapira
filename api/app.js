import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importando rotas
import adminRoutes from "./routes/product.js";
import publicRoutes from "./routes/public/static/public.js";
import authRoutes from "./routes/public/auth/auth.js";

// Instanciando servidor express
const app = express();

// Configurando dotenv
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", publicRoutes);
app.use("/auth", authRoutes);

// Ligando server

app.listen(process.env.PORT, () => {
    console.log(`Servidor ligado na porta ${process.env.PORT}!`);
});