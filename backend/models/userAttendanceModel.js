const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: [true, 'A user must have a code'],
        unique: false
    },
    attendanceStatus: {
        type: Number,
        enum: [0, 1], // Allowed values: 0 (absent), 1 (present)
        default: 1,
    },
    isClockedIn: {
        type: Number,
        enum: [0, 1], // Allowed values: 0 (clock out), 1 (clock in)
        default: 1,
    },
    clockInTime: {
        type: Date,
        default: Date.now()
    },
    location: {
        // geoJson
        type: {
            type: String,
            default: 'Point',
            enum: ["Point"]
        },
        cooridnates: [Number],
        address: String,
        description: String,

    },
    clockOutTime: {
        type: Date,
        default: null
    },
    workingHour: {
        type: String,
        default: '0' // Set default working hour as '0'
    },
    status: {
        type: Number,
        enum: [0, 1], // Allowed values: 0 (Inactive), 1 (Active)
        default: 1,
        select: false
    }
});


// Define a pre-save middleware to convert times to IST
attendanceSchema.pre('save', async function (next) {
    try {
        if (this.clockInTime) {
            const istOffset = 5.5 * 60 * 60 * 1000;
            // Calculate IST time by adding the IST offset to UTC time
            const istClockInTime = new Date(new Date().getTime() + istOffset);
            this.clockInTime = istClockInTime;
        }

        // if (this.clockOutTime) {
        //     const istOffset = 5.5 * 60 * 60 * 1000;
        //     // Calculate IST time by adding the IST offset to UTC time
        //     const istClockOutTime = new Date(new Date().getTime() + istOffset);
        //     this.clockOutTime = istClockOutTime;
        // }

        next(); // Proceed to the next middleware
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
});

// Define the Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Export the model
module.exports = Attendance;