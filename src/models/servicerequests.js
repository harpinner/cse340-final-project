import db from "./db.js";

const getServiceRequestById = async (id) => {
    const query = 'SELECT * FROM service_requests WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const createServiceRequest = async (userId, description) => {
    const query = 'INSERT INTO service_requests (user_id, description) VALUES ($1, $2) RETURNING *';
    const values = [userId, description];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateServiceRequestStatus = async (id, newStatus) => {
    const query = 'UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING *';
    const values = [newStatus, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteServiceRequest = async (id) => {
    const query = 'DELETE FROM service_requests WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getServiceRequestsByUserId = async (userId) => {
    const query = 'SELECT * FROM service_requests WHERE user_id = $1';
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
}


const getAllServiceRequests = async () => {
    const query = 'SELECT * FROM service_requests';
    const result = await db.query(query);
    return result.rows;
}

export { getServiceRequestById, createServiceRequest, updateServiceRequestStatus, deleteServiceRequest, getAllServiceRequests, getServiceRequestsByUserId };