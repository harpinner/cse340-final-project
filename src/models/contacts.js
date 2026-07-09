import db from "./db.js";

const getContactById = async (id) => {
    const query = 'SELECT contacts.*, users.username as username, users.email as email FROM contacts JOIN users ON users.id = contacts.user_id WHERE contacts.id = $1;';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const createContact = async (user_id, message) => {
    const query = 'INSERT INTO contacts (user_id, message) VALUES ($1, $2) RETURNING *';
    const values = [user_id, message];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getContactsByUserId = async (user_id) => {
    const query = 'SELECT contacts.*, users.username as username, users.email as email FROM contacts JOIN users ON users.id = contacts.user_id WHERE contacts.user_id = $1';
    const values = [user_id];
    const result = await db.query(query, values);
    return result.rows;
}

const getAllContacts = async () => {
    const query = 'SELECT contacts.*, users.username as username, users.email as email FROM contacts JOIN users ON users.id = contacts.user_id';
    const result = await db.query(query);
    return result.rows;
}


const updateContact = async (id, user_id, message) => {
    const query = 'UPDATE contacts SET user_id = $1, message = $2 WHERE id = $3 RETURNING *';
    const values = [user_id, message, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteContact = async (id) => {
    const query = 'DELETE FROM contacts WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

export { getContactById, createContact, getContactsByUserId, getAllContacts, updateContact, deleteContact };