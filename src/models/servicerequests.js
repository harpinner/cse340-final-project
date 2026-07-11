import db from "./db.js";

const getServiceRequestById = async (id) => {
    const query = 'SELECT * FROM service_requests WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getServiceRequestTypes = async () => {
    const query = 'SELECT id, name, category FROM service_types ORDER BY name';
    const result = await db.query(query);
    return result.rows;
}

const createServiceRequest = async (userId, vehicleId, serviceType, description, status = 'requested') => {
    const query = 'INSERT INTO service_requests (user_id, vehicle_id, service_type, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [userId, vehicleId, serviceType, description, status];
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
    const query = `SELECT 
    sr.id AS service_request_id,
    sr.service_type,
    sr.description AS request_description,
    sr.status,
    sr.created_at AS request_created_at,
    -- Vehicle details
    v.id AS vehicle_id,
    v.make,
    v.model,
    v.year,
    v.price,
    -- User details
    u.id AS user_id,
    u.username,
    u.email,
    u.role
FROM service_requests sr
LEFT JOIN vehicles v ON sr.vehicle_id = v.id
LEFT JOIN users u ON sr.user_id = u.id;`;
    const result = await db.query(query);
    return result.rows;
}

export { getServiceRequestById, createServiceRequest, updateServiceRequestStatus, getServiceRequestTypes, deleteServiceRequest, getAllServiceRequests, getServiceRequestsByUserId };
