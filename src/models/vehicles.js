import db from "./db.js";

const getVehicleById = async (id) => {
    const query = 'SELECT * FROM vehicles WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const createVehicle = async (make, model, year, price) => {
    const query = 'INSERT INTO vehicles (make, model, year, price) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [make, model, year, price];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateVehicle = async (id, make, model, year, price) => {
    const query = 'UPDATE vehicles SET make = $1, model = $2, year = $3, price = $4 WHERE id = $5 RETURNING *';
    const values = [make, model, year, price, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteVehicle = async (id) => {
    const query = 'DELETE FROM vehicles WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getAllVehicles = async () => {
    const query = 'SELECT DISTINCT ON (v.id) v.*, vi.image_url FROM vehicles v LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id ORDER BY v.id, vi.id ASC;';
    const result = await db.query(query);
    return result.rows;
}

const createVehicleImage = async (vehicleId, imageUrl) => {
    const query = 'INSERT INTO vehicle_images (vehicle_id, image_url) VALUES ($1, $2) RETURNING *';
    const values = [vehicleId, imageUrl];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getVehicleImageByVehicleId = async (vehicleId) => {
    const query = 'SELECT * FROM vehicle_images WHERE vehicle_id = $1';
    const values = [vehicleId];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateVehicleImage = async (vehicleId, imageUrl) => {
    const query = 'UPDATE vehicle_images SET image_url = $1 WHERE vehicle_id = $2 RETURNING *';
    const values = [imageUrl, vehicleId];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteVehicleImage = async (vehicleId) => {
    const query = 'DELETE FROM vehicle_images WHERE vehicle_id = $1 RETURNING *';
    const values = [vehicleId];
    const result = await db.query(query, values);
    return result.rows[0];
}

export { getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllVehicles, createVehicleImage, getVehicleImageByVehicleId, updateVehicleImage, deleteVehicleImage };
