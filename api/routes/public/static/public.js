import express from "express";
import path from "path";

// Definindo variáveis de Path;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../public/index.html"));
});

router.get("/vitrine", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../public/vitrine.html"));
});

router.get("/product", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../public/product2.html"));
});

export default router;