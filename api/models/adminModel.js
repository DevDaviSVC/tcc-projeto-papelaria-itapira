import pool from "../config/database";

const findByUsername = async (username) => {
    const result = await pool.query(
        "SELECT id, username, password_hash FROM admins WHERE username = $1",
        [username]
    );

    return result.rows[0];
};

export default findByUsername;