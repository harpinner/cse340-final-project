import { Router } from "express";
import { getAllUsers, deleteUser, getUserById, updateUser} from "../models/users.js";
import { getAllVehicles, deleteVehicle, createVehicle } from "../models/vehicles.js";
import { createCategory, getAllCategories, deleteCategory, updateCategory, getCategoryById } from "../models/categories.js";

const router = Router();

const index = async (req, res) => {
    const users = await getAllUsers();
    const vehicles = await getAllVehicles();
    const categories = await getAllCategories();
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    res.render('admin', { title: 'Admin Dashboard', users, vehicles, categories });
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render('editUser', { title: 'Edit User', user });
}

const deleteUserHandler = async (req, res) => {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
        return res.status(404).send('User not found');
    }
    res.redirect('/admin');
}



const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { email, role, username } = req.body;
    const updatedUser = await updateUser(id, email, role, username);
    res.redirect('/admin');
}


const createNewCategory = async (req, res) => {
    const { name } = req.body;
    const { description } = req.body;
    const newCategory = await createCategory(name, description);
    res.redirect('/admin');
}

const updateCategoryHandler = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await updateCategory(id, name, description);
    res.redirect('/admin');
}


router.get('/', index);
router.get('/users/:id', editUser);
router.post('/categories', createNewCategory);
router.put('/categories/:id', updateCategoryHandler);
router.delete('/categories/:id', deleteCategory);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUserHandler);

export { index, editUser, deleteUserHandler, updateUserRole };
export default router;