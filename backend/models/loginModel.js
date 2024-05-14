const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const loginSchema = new mongoose.Schema({

    userCode: {
        type: String,
        unique: true,
        required: [true, 'A user must have a code']
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
    password: {
        type: String,
        required: [true, "A employee must have a Password"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your Password"],
        validate: {
            // only works on create and save
            validator: function (el) {
                return el === this.password; // true and false
            },
            message: 'Passwords are not the same'
        }
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: "662395fb7422e5c9d9326e07",

    },
    token: {
        type: String,
        unique: true,
        select: false
    },
    passwordResetExpire: {
        type: String,

        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),

        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now(),

        select: false
    },
    status: {
        type: Number,
        enum: [0, 1], // Allowed values: 0 (Inactive), 1 (Active)
        default: 1,
        select: false
    }


})
//bcrypt pass
loginSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();

})



loginSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    this.updatedAt = Date.now() - 1000;

    next()

})

//login time check the pass are matches or not
//userPassword is stored on db
loginSchema.methods.isPasswordMatch = async function (
    password,
    userPassword
) {
    return await bcrypt.compare(password, userPassword)
}

// Define the changePasswordAfter method
loginSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.updatedAt) {
        const changeTimestamp = parseInt(this.updatedAt.getTime() / 1000, 10);
        // console.log(changeTimestamp, JWTTimestamp)
        return JWTTimestamp < changeTimestamp;
    }
    // false mean not change
    return false;
}


loginSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.token = crypto.createHash('sha256').update(resetToken).digest('hex');

    // console.log({ resetToken }, this.token);

    this.passwordResetExpire = Date.now() + 15 * 60 * 1000; // expires in 15 mins

    return resetToken;
}

const Login = mongoose.model("Login", loginSchema)
module.exports = Login;