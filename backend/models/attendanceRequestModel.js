const mongoose = require('mongoose');

const attendanceRequestSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: [true, 'A user must have a Id'],
        unique: false
    },

    date: {
        type: Date,
        required: [true, "Start date is required"],
    },

    reason: {
        type: String,
        required: [true, "Leave must have a reason"],
    },

    stage: {
        type: Number,
        enum: [1, 0, -1], // Allowed values: 0 (Inactive), 1 (Active)
        default: -1
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        enum: [0, 1], // Allowed values: 0 (Inactive), 1 (Active)
        default: 1
    }
})

const AttendanceRequest = mongoose.model("AttendanceRequest", attendanceRequestSchema)
module.exports = AttendanceRequest;