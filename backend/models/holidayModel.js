const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    holidayName: {
        type: String,
        required: [true, 'A Holiday must have a name'],
        unique: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    holidayDate: {
        type: Date,
        required: [true, 'A Holiday must have a Date'],
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

// Define a virtual property to get the formatted date (date - only)
holidaySchema.virtual('formattedDate').get(function () {
    // Use this.holidayDate to access the holidayDate field
    return this.holidayDate.toISOString().split('T')[0]; // Returns YYYY-MM-DD
});

const Holiday = mongoose.model("Holiday", holidaySchema)
module.exports = Holiday;