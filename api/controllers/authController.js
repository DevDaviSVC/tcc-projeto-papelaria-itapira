import authService from "../utils/authService.js";

const login = async (req, res, next) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || !username.trim() || username.length > 255 ||
        typeof password !== "string" || !password.length || Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({
            error: "Informe usuário e senha válidos (usuário: até 255 caracteres; senha: até 72 bytes).",
        });
    }
    try {
        const token = await authService(username.trim(), password);
        res.set("Cache-Control", "no-store");
        return res.status(200).json({ message: "Login realizado com sucesso", token });
    } catch (error) {
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        return next(error);
    }
};

export default login;
