import db from "db.js";

const getBlogById = async (id) => {
    const query = 'SELECT * FROM blogs WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}   

const createBlog = async (title, content, authorId) => {
    const query = 'INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [title, content, authorId];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateBlog = async (id, title, content) => {
    const query = 'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *';
    const values = [title, content, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteBlog = async (id) => {
    const query = 'DELETE FROM blogs WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getAllBlogs = async () => {
    const query = 'SELECT * FROM blogs';
    const result = await db.query(query);
    return result.rows;
}
export { getBlogById, createBlog, updateBlog, deleteBlog, getAllBlogs };