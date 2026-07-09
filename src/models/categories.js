import db from "./db.js";

const getCategoryById = async (id) => {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const createCategory = async (name) => {
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    const values = [name];
    const result = await db.query(query, values);
    return result.rows[0];
}


const updateCategory = async (id, name, description) => {
    const query = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *';
    const values = [name, description, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteCategory = async (id) => {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getAllCategories = async () => {
    const query = 'SELECT * FROM categories';
    const result = await db.query(query);
    return result.rows;
}

export { getCategoryById, createCategory, updateCategory, deleteCategory, getAllCategories };