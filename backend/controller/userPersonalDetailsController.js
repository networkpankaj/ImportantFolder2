const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Function to send email
const sendEmail = async (email, subject, message) => {
    // Create a transporter using SMTP transport
    const myEmail = 'vedansh@isuremedia.com';
    const transporter = nodemailer.createTransport({
        // Configure your email service provider here
        // Example using Gmail SMTP:

        service: 'gmail',
        auth: {
            user: myEmail, // Your email address
            pass: process.env.MAILPASSWORD  // Your email password (use environment variables in production)
        }
    });

    // Define email options
    const mailOptions = {
        from: myEmail, // Sender email address
        to: email, // Recipient email address
        subject: subject, // Email subject
        text: message // Plain text body
        // You can also use html property for HTML content
    };

    // Send email using the transporter
    await transporter.sendMail(mailOptions);
};


// Function to generate a random token
const generateRandomToken = (length) => {
    return crypto.randomBytes(length).toString('hex') + Date.now();
};

// Function to generate the next user code
const generateUserCode = async () => {
    const lastUser = await User.findOne({}, {}, { sort: { 'createdAt': -1 } }); // Find the most recent employee
    let lastCode = 'ISM10000'; // Default starting user code if no user exist

    if (lastUser && lastUser.userCode) {
        lastCode = lastUser.userCode;
    }

    // Extract the numeric part of the last user code
    const numericPart = parseInt(lastCode.slice(3)); // Extract the numeric part (e.g., 10000)
    const nextNumericPart = numericPart + 1; // Increment the numeric part by 1

    // Construct the new user code with the incremented numeric part
    const newUserCode = `ISM${nextNumericPart.toString().padStart(5, '0')}`;

    return newUserCode;
};


exports.getAllUserPersonalDetails = catchAsync(async (req, res, next) => {

    const user = await User.find()
        .select('-token -createdAt -updatedAt  -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            result: user.length,
            data: {
                user
            }
        });
})

exports.getUserPersonalDetails = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.params.id)
        .select('-token -createdAt -updatedAt  -__v');

    if (!user || user.status === 0) {
        return next(new AppError('user not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                user
            }
        });
})

exports.createUserPersonalDetails = catchAsync(async (req, res, next) => {

    req.body.token = generateRandomToken(16);
    req.body.userCode = await generateUserCode();

    const user = await User.create(req.body)
    // Specify the fields to exclude from the response

    const { token, updatedAt, status, __v, ...filteredUser } = user.toObject();


    // Send email to the user
    const userEmail = user.userEmail; // Assuming user email is stored in 'email' field
    const subject = 'Welcome to Our Website';
    const message = `Hi ${user.userName},\n\nWelcome to our website! Your account has been created successfully.\n\nPlease click on the following link to activate your account:\n\nhttp://localhost:5173/auth/signUp?token=${user.token}`;


    await sendEmail(userEmail, subject, message);

    res.status(200)
        .json({
            status: "success",
            data: {
                user: filteredUser
            }
        });

})


exports.updateUserPersonalDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userName } = req.body;
    const updatedUser = await User.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if User is active (status: 1)
        { userName }, // Update UserName
        { new: true, runValidators: true }
    ).select('-updatedAt -status -__v');

    if (!updatedUser) {
        // If User is not found or already inactive, return 404 error
        return next(new AppError('User not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                updatedUser
            }
        });
});




exports.activateUserPersonalDetails = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedUser = await User.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if User is active (status: 1)
        { status: 1 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    ).select('-updatedAt  -__v');

    if (!updatedUser) {
        // If User is not found or already inactive, return 404 error
        return next(new AppError('User not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                updatedUser
            }
        });

})

exports.deleteUserPersonalDetails = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedUser = await User.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if User is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        // If User is not found or already inactive, return 404 error
        return next(new AppError('User not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})


exports.activateUserPersonalDetails = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedUser = await User.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if User is inactive (status: 0)
        { status: 1 }, // Update status to 1 (active)
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedUser) {
        // If User is not found or already active, return 404 error
        return next(new AppError('User not found or already active', 404));
    }

    // Send success response with updatedUser data
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    });

})