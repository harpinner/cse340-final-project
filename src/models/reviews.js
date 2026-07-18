import db from "./db.js";

const getReviewById = async (id) => {
    const query = 'SELECT * FROM reviews WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
};

const createReview = async (userId, vehicleId, rating, comment) => {
    const query = 'INSERT INTO reviews (user_id, vehicle_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [userId, vehicleId, rating, comment];
    const result = await db.query(query, values);
    return result.rows[0];
}

const updateReview = async (id, rating, comment) => {
    const query = 'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *';
    const values = [rating, comment, id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const deleteReview = async (id) => {
    const query = 'DELETE FROM reviews WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rows[0];
}

const getAllReviews = async () => {
    const query = 'SELECT * FROM reviews';
    const result = await db.query(query);
    return result.rows;
}

const getReviewsByVehicleId = async (vehicleId) => {
    const query = `SELECT
    r.id AS review_id,
    r.vehicle_id,
    r.rating,
    r.comment,
    r.created_at,
    -- Reviewer details
    u.id AS user_id,
    u.username,
    u.email,
    u.role
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.vehicle_id = $1;`;
    const values = [vehicleId];
    const result = await db.query(query, values);
    return result.rows;
}

export { getReviewById, createReview, updateReview, deleteReview, getAllReviews, getReviewsByVehicleId };