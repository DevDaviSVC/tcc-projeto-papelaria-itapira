import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";
import { getAuthConfig } from "../config/auth.js";

// Executa bcrypt também para usuários inexistentes.
const dummyHash = await bcrypt.hash("unused-login-placeholder", 10);

async function login(username, password) {
  const admin = await adminModel.findByUsername(username);

  const passwordMatch = await bcrypt.compare(password, admin?.password_hash || dummyHash);

  if (!admin || !passwordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const config = getAuthConfig();
  const token = jwt.sign(
    {
      id: admin.id,
      username: admin.username,
      role: "admin",
    },
    config.secret,
    {
      expiresIn: config.expiresIn,
      algorithm: config.algorithm,
      issuer: config.issuer,
      audience: config.audience,
      subject: String(admin.id),
    },
  );

  return token;
}

export default login;
