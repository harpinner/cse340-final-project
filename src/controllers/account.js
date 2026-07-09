import { getUserByEmail, createUser, getUserById, updateUserPassword, deleteUser, getAllUsers, getUserByUsername } from "../models/users.js";
import { Router } from "express";

const router = Router();


const register = async (req, res) => {
    const { email, password, role, username } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await createUser(email, password, role, username);
    //res.status(201).json({ message: 'User created successfully', user: newUser });
    
    res.redirect('/login'); // Redirect to the login page after successful registration
};


const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    if(user.username === username && user.password === password){

        delete user.password; // Remove password from user object before sending response

        req.session.user = user; // Store user in session

       // res.status(200).json({ message: 'Login successful', user });
        res.render('placeholder', { title: 'Home' });
    }
}

const logout = async (req, res) => {
    // Implement logout logic here (e.g., clearing session or token)
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
}

const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    const updatedUser = await updateUserPassword(id, newPassword);
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Password updated successfully', user: updatedUser });
}


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/users/:id/password', updatePassword);

export default router;