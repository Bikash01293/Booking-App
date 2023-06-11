const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const Appointment = require('../model/appointmentShema');

const register = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate user input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      //Check if user already exists
      try {
        await admin.auth().getUserByEmail(email);
        return res.status(200).json({message: `${email} is already registered. Please use another email.`});
      } catch(error) {
        if(error.code != 'auth/user-not-found') {
          throw error;
        }
      }
      
      //Continue with user registration if user does not exist
      // Create the user using Firebase Authentication
      await admin.auth().createUser({
        email,
        password
      });
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
}

const login = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Authenticate the user using Firebase Authentication
      const userRecord = await admin.auth().getUserByEmail(email);
      const user = userRecord.uid;
  
      // Generate JWT token for authorization
      const token = jwt.sign({ user }, process.env.SECRET_KEY); 
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
}

const createAppointment = async (req, res) => {
    try {
      const { date, time, user, status } = req.body;

      Appointment.date = date
      Appointment.time = time
      Appointment.user = user
      Appointment.status = status
  
      // Create a new appointment in Firebase Realtime Database
      const newAppointmentRef = await admin.database().ref('appointments').push();
      await newAppointmentRef.set(Appointment);
  
      return res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ error: 'Failed to create appointment' });
    }
}

const getAppointments = async (req, res) => {
    try {
      // Retrieve all appointments from Firebase Realtime Database
      const snapshot = await admin.database().ref('appointments').once('value');
      const appointments = snapshot.val();
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      return res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
}

const getAppointmentById = async (req, res) => {
    try {
      const appointmentId = req.params.id;
  
      // Retrieve a specific appointment from Firebase Realtime Database by its ID
      const snapshot = await admin.database().ref(`appointments/${appointmentId}`).once('value');
      const appointment = snapshot.val();
  
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Error retrieving appointment:', error);
      return res.status(500).json({ error: 'Failed to retrieve appointment' });
    }
}

const updateAppointment = async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const { date, time, user, status } = req.body;
  
      // Create an object to hold the fields to be updated
      const updatedFields = {};
  
      // Add the fields to be updated to the object
      if (date) {
        updatedFields.date = date;
      }
      if (time) {
        updatedFields.time = time;
      }
      if (user) {
        updatedFields.user = user;
      }
      if (status) {
        updatedFields.status = status;
      }
  
      // Update a specific appointment in Firebase Realtime Database by its ID
      await admin.database().ref(`appointments/${appointmentId}`).update(updatedFields);
  
      return res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({ error: 'Failed to update appointment' });
    }
}

const deleteAppointment = async (req, res) => {
    try {
      const appointmentId = req.params.id;
  
      // Delete a specific appointment from Firebase Realtime Database by its ID
      await admin.database().ref(`appointments/${appointmentId}`).remove();
  
      return res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return res.status(500).json({ error: 'Failed to delete appointment' });
    }
}

module.exports = {
    register,
    login,
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
}