const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authUser');
const {
    register,
    login,
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment 
} = require('../controller/userController')


// Register a new user using Firebase Authentication
router.post('/register', register);

// Authenticate the user and return a JWT token
router.post('/login', login);

// CRUD operations on appointments
router.post('/appointments', authenticateUser, createAppointment);

router.get('/appointments', authenticateUser, getAppointments);

router.get('/appointments/:id', authenticateUser, getAppointmentById);

router.put('/appointments/:id', authenticateUser, updateAppointment);

router.delete('/appointments/:id', authenticateUser, deleteAppointment);

module.exports = router;