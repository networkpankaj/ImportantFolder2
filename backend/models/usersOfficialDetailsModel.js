const mongoose = require('mongoose');
const userOfficialSchema = new mongoose.Schema({

    userID: {
        type: String,
        required: [true, 'A user must have a code'],
        unique: true
    },

    joining_date: {
        type: Date,
        default: Date.now()
    },

    termination_date: {
        type: Date,
        default: Date.now()
    },

    probation_period: {
        type: String,
        required: [true, "A user must have a phone number"],
        maxlength: 15,
        trim: true
    },

    confirmation_date: {
        type: Date,
        default: Date.now()
    },

    salary: {
        type: Number,
        default: 0
    },

    allowedSickLeave: {
        type: Number,
        default: 0
    },

    allowedCasualLeave: {
        type: Number,
        default: 0
    },

    allowedLOP: {
        type: Number,
        default: 0
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

const UserOfficial = mongoose.model("UserOfficialDetail", userOfficialSchema)
module.exports = UserOfficial;