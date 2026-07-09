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
    const query = 'SELECT * FROM vehicles';
    const result = await db.query(query);
    return result.rows;
}

const createVehicleImage = async (vehicleId, imagePath) => {
    const query = 'INSERT INTO vehicle_images (vehicle_id, image_path) VALUES ($1, $2) RETURNING *';
    const values = [vehicleId, imagePath];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getVehicleImageByVehicleId = async (vehicleId) => {
    const query = 'SELECT * FROM vehicle_images WHERE vehicle_id = $1';
    const values = [vehicleId];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateVehicleImage = async (vehicleId, imagePath) => {
    const query = 'UPDATE vehicle_images SET image_path = $1 WHERE vehicle_id = $2 RETURNING *';
    const values = [imagePath, vehicleId];
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