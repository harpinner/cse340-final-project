import { getUserByEmail, createUser, getUserById, updateUserPassword, deleteUser, getAllUsers, getUserByUsername } from "../models/users.js";



const register = async (req, res) => {
    const { email, password, role, username } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await createUser(email, password, role, username);
    res.status(201).json({ message: 'User created successfully', user: newUser });
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
        res.status(200).json({ message: 'Login successful', user });
    }
}