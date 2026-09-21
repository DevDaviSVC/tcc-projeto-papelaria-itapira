import express from "express";
import productRoutes from "../product.js";

const router = express.Router();
router.get("/me", (req, res) => res.json({ admin: req.admin }));
router.use("/products", productRoutes);

export default router;
