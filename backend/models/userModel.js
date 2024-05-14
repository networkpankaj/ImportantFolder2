const mongoose = require('mongoose');
const crypto = require("crypto");
var validator = require('validator');

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: [true, 'A user must have a name'],
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    userEmail: {
        type: String,
        required: [true, 'A user must have a email'],
        maxlength: 100,
        unique: true,
        // Validate email 
        validate: [validator.isEmail, "please provide a valid email"],
        trim: true,
        lowercase: true
    },

    userPhoneNumber: {
        type: String,
        required: [true, "A user must have a phone number"],
        maxlength: 15,
        trim: true
    },

    userCode: {
        type: String,
        required: [true, "A user must have a Code"],
        maxlength: 15,
        trim: true,
        unique: true
    },

    userDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'A user must have a Department']
    },

    userDesignation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designation',
        required: [true, 'A user must have a Designation']
    },


    token: {
        type: String,
        unique: true
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
        default: 0
    }

})

userSchema.methods.createToken = function () {

    const signupToken = crypto.randomBytes(32).toString('hex');
    this.token = crypto.createHash('sha256').update(signupToken).digest('hex');

    console.log({ signupToken }, this.token);

    this.passwordResetExpire = Date.now() + 15 * 60 * 1000; // expires in 15 mins

    return signupToken;
}

const User = mongoose.model("User", userSchema)
module.exports = User;