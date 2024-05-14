const mongoose = require('mongoose');

const yearlyLeaveSchema = new mongoose.Schema({

    leaveType: {
        type: String,
        required: [true, 'A leave must have a type'],
        unique: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    noOfLeave: {
        type: Number,
        required: [true, 'A leave must have a Numbers'], // Allowed values: 0 (Inactive), 1 (Active)
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

const YearlyLeave = mongoose.model("YearlyLeave", yearlyLeaveSchema)
module.exports = YearlyLeave;