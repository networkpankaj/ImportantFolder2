const mongoose = require('mongoose');
const userPersonalSchema = new mongoose.Schema({

    userID: {
        type: String,
        required: [true, 'A user must have a code'],
        unique: true
    },

    fatherName: {
        type: String,
        required: [true, 'A user must have a father name'],
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    fatherOccupation: {
        type: String,
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    fatherPhoneNumber: {
        type: String,
        required: [true, "A user must have a phone number"],
        maxlength: 15,
        trim: true
    },

    motherName: {
        type: String,
        required: [true, 'A user must have a mother name'],
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    motherOccupation: {
        type: String,
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    spouseName: {
        type: String,
        required: [true, 'A user must have a spouse name'],
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    spouseOccupation: {
        type: String,
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },
    noOfChildren: {
        type: Number,
        required: [true, 'No of Children is required'],
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

const UserDetails = mongoose.model("UserDetails", userPersonalSchema)
module.exports = UserDetails;