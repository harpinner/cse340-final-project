import db from "db.js";

const getBlogById = async (id) => {
    const query = 'SELECT blogs.*, users.id as author_id, users.name as author FROM blogs JOIN users ON blogs.author_id = users.id WHERE blogs.id = $1';
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
    const query = 'SELECT blogs.*, users.id as author_id, users.username as author FROM blogs JOIN users ON blogs.author_id = users.id';
    const result = await db.query(query);
    return result.rows;
}

const createComment  = async (blog_id, user_id, content) => {
    const query = 'INSERT INTO blog_comments (post_id, user_id, comment)VALUES ($1, $2, $3) RETURNING *';
    const values = [blog_id, user_id, content];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateComment = async(blog_id, content) =>{
    const query = 'UPDATE blog_comments SET content = $1 WHERE id = $2 RETURNING *';
    const values = [blog_id,content];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteComment = async(id) =>{
    const query = 'DELETE FROM blog_comments WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getAllComments = async (blog_id) => {
    const query = 'SELECT blog_comments.*, users.id as user_id, users.username as user FROM blog_comments JOIN users ON blog_comments.user_id = users.id WHERE blog_comments.post_id = $1';
    const values = [blog_id];
    const result = await db.query(query, values);
    return result.rows;
}

export { getBlogById, createBlog, updateBlog, deleteBlog, getAllBlogs, createComment, updateComment, deleteComment, getAllComments };