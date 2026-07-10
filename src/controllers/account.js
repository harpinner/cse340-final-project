import { getUserByEmail, createUser, getUserById, updateUserPassword, deleteUser, getAllUsers, getUserByUsername } from "../models/users.js";
import { getServiceRequestById, createServiceRequest, updateServiceRequestStatus, deleteServiceRequest, getAllServiceRequests, getServiceRequestsByUserId } from "../models/servicerequests.js";
import { Router } from "express";
import { body, validationResult } from 'express-validator';
import flash from 'express-flash-message';
import bcrypt from 'bcrypt';

const router = Router();

const registrationValidationRules = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['user', 'admin']).withMessage('Invalid role'),
    body('username').notEmpty().withMessage('Username is required')
];

const loginValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const serviceRequestValidationRules = [
    body('description').notEmpty().withMessage('Description is required'),
    body('vehicle_id').isInt().withMessage('Vehicle ID must be an integer'),
    body('service_type').notEmpty().withMessage('Service type is required')
];

const updatePasswordValidationRules = [
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};




const register = async (req, res) => {
    const { email, password, role, username } = req.body;
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
        req.flash('error', 'User already exists');
       // return res.status(400).json({ message: 'User already exists' });
    }

    const results = validationResult(req);
    if (!results.isEmpty()) {
        req.flash('error', results.array().map(err => err.msg).join(', '));
        //return res.status(400).json({ errors: results.array() });
        res.redirect('/register'); // Redirect back to the registration page with error messages
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword, role, username);
    //res.status(201).json({ message: 'User created successfully', user: newUser });
    
    res.redirect('/login'); // Redirect to the login page after successful registration
};


const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;
    if (!user) {
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');     
    }
    if (!passwordMatch) {
       // return res.status(401).json({ message: 'Invalid username or password' });
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');     
    }
    if(user.username === username && passwordMatch){

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
    results = validationResult(req);
    if (!results.isEmpty()) {
        return res.status(400).json({ errors: results.array() });
    }
    const { id } = req.params;
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updateUserPassword(id, hashedPassword);
    if (!updatedUser) {
        req.flash('error', 'User not found');
        //return res.status(404).json({ message: 'User not found' });
        res.redirect('/update-password');
    }
    req.flash('success', 'Password updated successfully');
    res.redirect('/login');
}

const userDashboard = async (req, res) => {
    if (!req.session.user) {
        //return res.status(401).json({ message: 'Unauthorized' });
        res.redirect('/login');
        return;
    }
    const userId = req.session.user.id;
    const user = await getUserById(userId);
    const serviceRequests = await getServiceRequestsByUserId(userId);
    res.render('account', { title: 'Account', user: user, serviceRequests: serviceRequests });
    //res.status(200).json({ user, serviceRequests });

}

const requestService = async (req, res) => {
    if (!req.session.user) {
       // return res.status(401).json({ message: 'Unauthorized' });
        res.redirect('/login');
        return;
    }
    

    const userId = req.session.user.id;
    const { description, vehicle_id, service_type } = req.body;
    const newServiceRequest = await createServiceRequest(userId, description);
   // res.status(201).json({ message: 'Service request created successfully', serviceRequest: newServiceRequest });
    res.redirect('/account'); // Redirect to the account page after creating the service request
}


const deleteServiceRequestById = async (req, res) => {
    const { id } = req.params;
    const deletedServiceRequest = await deleteServiceRequest(id);
    if (!deletedServiceRequest) {
        return res.status(404).json({ message: 'Service request not found' });
    }
    // res.status(200).json({ message: 'Service request deleted successfully', serviceRequest: deletedServiceRequest });
    res.redirect('/account'); // Redirect to the account page after deleting the service request
}

const updateServiceRequestStatusById = async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body;
    const updatedServiceRequest = await updateServiceRequestStatus(id, newStatus);
    if (!updatedServiceRequest) {
        return res.status(404).json({ message: 'Service request not found' });
    }
    // res.status(200).json({ message: 'Service request status updated successfully', serviceRequest: updatedServiceRequest });
    res.redirect('/account'); // Redirect to the account page after updating the service request status
}

router.post('/register', registrationValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);
router.post('/logout', logout);
router.put('/users/:id/password', updatePasswordValidationRules, validate, updatePassword);
router.get('/users/', userDashboard);
router.post('/service-requests', serviceRequestValidationRules, validate, requestService);
router.delete('/service-requests/:id', deleteServiceRequestById);
router.put('/service-requests/:id/status', updateServiceRequestStatusById);

export default router;