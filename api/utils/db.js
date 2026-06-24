import { Pool } from "pg";

// Faz a conexão ao banco de dados PostgreSQL
const pool = new Pool({
    user:"",
    host: "",
    database: "",
    password: "",
    port: 5432,
});

export default pool;