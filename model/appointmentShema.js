//Creating schema object for an appointment
const appointmentSchema = {
    date: '',    // string: The date of the appointment in a specific format (e.g., "YYYY-MM-DD").
    time: '',    // string: The time of the appointment (e.g., "HH:MM").
    user: '',  // string: The unique identifier of the user associated with the appointment.
    status: ''   // string: The status of the appointment (e.g., "scheduled", "completed", "cancelled").
};

module.exports = appointmentSchema;