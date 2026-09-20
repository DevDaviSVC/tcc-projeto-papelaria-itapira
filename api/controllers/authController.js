import authService from "../utils/authService.js";

const login = async (req, res) => {
    console.log("were getting here");
    
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Usuário e senha são obrigatórios",
      });
    }

    const token = await authService(username, password);

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
    });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    };

    return res.status(500).json({
        error: "Erro interno do servidor",
    });
  }
};

export default login;