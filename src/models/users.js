import db from "db.js";


const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const result = await db.query(query, values);
    return result.rows[0];
}

const createUser = async (email, passwordHash, role, username) => {
    const query = 'INSERT INTO users (email, password_hash, role, username) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [email, passwordHash, role, username];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateUserPassword = async (id, newPasswordHash) => {
    const query = 'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *';
    const values = [newPasswordHash, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}


const getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    const result = await db.query(query);
    return result.rows;
};

export { getUserByEmail, createUser, getUserById, updateUserPassword, deleteUser, getAllUsers, getUserByUsername };