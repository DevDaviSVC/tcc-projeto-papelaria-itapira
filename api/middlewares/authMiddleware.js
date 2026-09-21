import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";
import { getAuthConfig } from "../config/auth.js";

export default async function authenticateAdmin(req, res, next) {
    const match = /^Bearer ([^\s]+)$/i.exec(req.get("Authorization") || "");
    const unauthorized = () => res.status(401).json({ error: "Token ausente, inválido ou expirado" });
    if (!match) return unauthorized();

    try {
        const config = getAuthConfig();
        let payload;
        try {
            payload = jwt.verify(match[1], config.secret, {
                algorithms: [config.algorithm],
                issuer: config.issuer,
                audience: config.audience,
            });
        } catch {
            return unauthorized();
        }
        if (!payload || payload.role !== "admin" || !Number.isFinite(payload.exp) ||
            !["string", "number"].includes(typeof payload.id) ||
            !String(payload.id).trim() || payload.sub !== String(payload.id)) {
            return unauthorized();
        }
        const admin = await adminModel.findById(payload.id);
        if (!admin) return unauthorized();

        req.admin = admin;
        res.set("Cache-Control", "no-store");
        return next();
    } catch (error) {
        return next(error);
    }
}
