import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importando rotas
import productRoutes from "./routes/product.js";

// Instanciando servidor express
const app = express();

// Configurando dotenv
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
// Rotas

app.use(express.static(path.join(__dirname, 'public')));
app.use("/vitrine", express.static(path.join(__dirname, 'public/vitrine.html')));
app.use("/product", express.static(path.join(__dirname, 'public/product.html')));
app.use("/product2", express.static(path.join(__dirname, 'public/product2.html')));

// Ligando server

app.listen(process.env.PORT, () => {
    console.log(`Servidor ligado na porta ${process.env.PORT}!`);
});