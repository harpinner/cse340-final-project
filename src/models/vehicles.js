import db from "db.js";

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

export { getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllVehicles };