const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    designationName: {
        type: String,
        required: [true, 'A Designation must have a name'],
        unique: true,
        maxlength: 50,
        trim: true,
        lowercase: true
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

const Designation = mongoose.model("Designation", designationSchema)
module.exports = Designation;