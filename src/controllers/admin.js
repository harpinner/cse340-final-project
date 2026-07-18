import { Router } from "express";
import { getAllUsers, deleteUser, getUserById, updateUserRole as updateUserRoleInDb } from "../models/users.js";

import { createCategory, getAllCategories, deleteCategory, updateCategory, getCategoryById } from "../models/categories.js";
import { body, validationResult } from 'express-validator';
import flash from 'express-flash-message';

const router = Router();
flash(router);

const index = async (req, res) => {
    const users = await getAllUsers();
    
    const categories = await getAllCategories();
    if (!req.session.user || req.session.user.role !== 'admin') {
         res.flash('error', 'Access denied. Admins only.');
         return res.redirect('/login');
    }
    res.render('forms/admin', { title: 'Admin Dashboard', users, categories });
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
    try {
        const deletedUser = await deleteUser(id);
        if (!deletedUser) {
            res.flash('error', 'User not found');
            return res.redirect('/admin');
        }

        res.flash('success', 'User deleted successfully');
        return res.redirect('/admin');
    } catch (error) {
        if (error.code === '23503') {
            res.flash('error', 'This user cannot be deleted because they have related records, such as blog posts, reviews, or service requests.');
            return res.redirect('/admin');
        }

        throw error;
    }
}



const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await updateUserRoleInDb(id, role);
    res.flash('success', 'User role updated successfully');
    res.redirect('/admin');
}


const createNewCategory = async (req, res) => {
    const { name } = req.body;
    const { description } = req.body;
    const newCategory = await createCategory(name, description);
    res.flash('success', 'Category created successfully');
    res.redirect('/admin');
}

const updateCategoryHandler = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await updateCategory(id, name, description);
    res.flash('success', 'Category updated successfully');
    res.redirect('/admin');
}

const getCategoryByIdHandler = async (req, res) => {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
        res.flash('error', 'Category not found');
        return res.redirect('/admin');
    }
    res.render('forms/category', { title: 'Edit Category', category });
}




const deleteCategoryHandler = async (req, res) => {
    const { id } = req.params;
    const deletedCategory = await deleteCategory(id);
    if (!deletedCategory) {
        res.flash('error', 'Category not found');
        //return res.status(404).json({ message: 'Category not found' });
        res.redirect('/admin');
    }
    res.flash('success', 'Category deleted successfully');
    res.redirect('/admin');
}


router.get('/', index);
router.get('/users/:id', editUser);
router.get('/categories/:id', getCategoryByIdHandler);
router.post('/categories', createNewCategory);
router.put('/categories/:id', updateCategoryHandler);
router.delete('/categories/:id', deleteCategoryHandler);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUserHandler);

export default router;
