import express from "express";

const router = express.Router();

router.post("login", (req, res) => {
    try {
        
    } catch (error) {
        res.json({error: "Erro no servidor."}).status(500)
    }
});

export default router;