import { Router } from "express";
import { getAllUsers, deleteUser } from "../models/users.js";
import { getAllVehicles, deleteVehicle, createVehicle } from "../models/vehicles.js";

const router = Router();

const index = async (req, res) => {
    const users = await getAllUsers();
    const vehicles = await getAllVehicles();
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    res.render('admin', { title: 'Admin Dashboard', users, vehicles });
}

router.get('/', index);

export default router;