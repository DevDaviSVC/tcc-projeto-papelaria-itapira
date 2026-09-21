import pool from "../config/database.js";

const findByUsername = async (username) => {
    const result = await pool.query(
        "SELECT id, username, password_hash FROM public.admins WHERE username = $1",
        [username]
    );

    return result.rows[0];
};

const findById = async (id) => {
    const result = await pool.query(
        "SELECT id, username FROM public.admins WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export default { findByUsername, findById };
