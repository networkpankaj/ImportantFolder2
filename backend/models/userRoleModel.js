const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
    userRoleName: {
        type: String,
        required: [true, 'A role must have a name'],
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

const UserRole = mongoose.model("UserRole", userRoleSchema)
module.exports = UserRole;