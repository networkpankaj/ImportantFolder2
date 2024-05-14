const User = require("./../models/userModel");
const UserPersonal = require("./../models/usersPersonalDetailsModel");
const UserOfficial = require("./../models/usersOfficialDetailsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require('crypto');

const sendEmail = require("../utils/email");

//allow the fields to update
filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    return newObj;
}



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


exports.getAllUser = catchAsync(async (req, res, next) => {
    const { userCode } = req.query;
    const queryObj = {};

    // Filter by userID if provided
    if (userCode) {
        queryObj.userCode = userCode;
    }
    console.log(res.user)

    const user = await User.find(queryObj)
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



exports.getUser = catchAsync(async (req, res, next) => {
    // console.log(res.user._id)
    // console.log(currentUser)

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

exports.createUser = catchAsync(async (req, res, next) => {

    req.body.userCode = await generateUserCode();  // user code like ISM10001

    const user = await User.create(req.body)   // data send by user

    const signupToken = user.createToken();
    await user.save({ validateBeforeSave: false })

    // Specify the fields to exclude from the response
    const { token, updatedAt, status, __v, ...filteredUser } = user.toObject();


    // Send email to the user
    const userEmail = user.userEmail;
    const subject = 'Welcome to Our Website';

    // const redirectUrl = `${req.protocol}://${req.get('host')}/api/v1/user/signUp/${signupToken}`;
    const redirectUrl = `http://localhost:5173/auth/signUp?token=${signupToken}`;

    const message = `Hi ${user.userName},\n\nWelcome to our website! Your account has been created successfully.\n\nPlease click on the following link to activate your account:\n\n${redirectUrl}`;

    try {
        await sendEmail(userEmail, subject, message);
        res.status(200)
            .json({
                status: "success",
                message: "Create Password  and Verification Email has been sent.",
                data: {
                    user: filteredUser
                }
            });
    } catch (err) {
        user.token = undefined;
        await user.save({ validateBeforeSave: false })
        // return next(new AppError(err, 500))
        return next(new AppError("There was an error sending the email. Try again later", 500))
    }

})



exports.updateUser = catchAsync(async (req, res, next) => {

    //update the user document
    const { id } = req.params;

    // Filter out unwanted fields from req.body
    const filteredBody = filterObj(req.body, "userName", "userPhoneNumber", "userDepartment", "userDesignation");

    // Update the user document
    const updatedUser = await User.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if User is active (status: 1)
        { ...filteredBody }, // Spread filteredBody into the update object
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
                user: updatedUser
            }
        });
});




exports.activateUser = catchAsync(async (req, res, next) => {

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

exports.deleteUser = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedUser = await User.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if User is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        // If User is not found or already inactive, return 404 error
        return next(new AppError('User not found or already  deleted', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})


exports.activateUser = catchAsync(async (req, res, next) => {

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



// ________________________controller for personal details__________________________

exports.getUserPersonalDetails = catchAsync(async (req, res, next) => {
    const { code } = req.query;
    console.log(code)


    // Find user by 'code' field 
    const userPersonalData = await UserPersonal.find({ "userID": code }).select('-createdAt -updatedAt -__v');

    // Check if userPersonalData is not found or is inactive (status === 0)
    if (!userPersonalData || userPersonalData.status === 0) {
        return next(new AppError('User not found', 404));
    }

    // Send successful response with user data
    res.status(200).json({
        status: "success",
        data: {
            user: userPersonalData
        }
    });
});


exports.createUserPersonalDetails = catchAsync(async (req, res, next) => {

    const { code } = req.query;
    req.body.userID = code;

    const userPersonalData = await UserPersonal.create(req.body)

    // Specify the fields to exclude from the response
    const { token, updatedAt, status, __v, ...filteredUser } = userPersonalData.toObject();

    res.status(200)
        .json({
            status: "success",
            data: {
                user: filteredUser
            }
        });

    // console.log(req.body);

})


exports.updateUserPersonalDetails = catchAsync(async (req, res, next) => {
    const { code } = req.query;
    const updateData = req.body; // Access the entire req.body as updateData
    console.log(code)

    const updatedUser = await UserPersonal.findOneAndUpdate(
        { "userID": code, status: 1 }, // Find only if User is active (status: 1)
        { $set: updateData }, // Update fields specified in updateData
        { new: true, runValidators: true } // Return updated document and run validators
    ).select('-updatedAt -status -__v');

    if (!updatedUser) {
        // If User is not found or already inactive, return 404 error
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    });
});






// ________________________controller for official details__________________________

exports.getUserOfficialDetails = catchAsync(async (req, res, next) => {
    const { code } = req.query;
    console.log(code)

    // Find user by 'code' field 
    const userPersonalData = await UserOfficial.find({ "userID": code }).select('-createdAt -updatedAt -__v');

    // Check if userPersonalData is not found or is inactive (status === 0)
    if (!userPersonalData || userPersonalData.status === 0) {
        return next(new AppError('User not found', 404));
    }

    // Send successful response with user data
    res.status(200).json({
        status: "success",
        data: {
            user: userPersonalData
        }
    });
});



exports.createUserOfficialDetails = catchAsync(async (req, res, next) => {

    const { code } = req.query;
    req.body.userID = code;

    const userOfficialData = await UserOfficial.create(req.body)

    // Specify the fields to exclude from the response
    const { updatedAt, status, __v, ...filteredUser } = userOfficialData.toObject();

    res.status(200)
        .json({
            status: "success",
            data: {
                user: filteredUser
            }
        });

    // console.log(req.body);

})


exports.updateUserOfficialDetails = catchAsync(async (req, res, next) => {
    const { code } = req.query;
    const updateData = req.body; // Access the entire req.body as updateData
    console.log(code)

    const updatedUser = await UserOfficial.findOneAndUpdate(
        { "userID": code, status: 1 }, // Find only if User is active (status: 1)
        { $set: updateData }, // Update fields specified in updateData
        { new: true, runValidators: true } // Return updated document and run validators
    ).select('-updatedAt -status -__v');

    if (!updatedUser) {
        // If User is not found or already inactive, return 404 error
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    });
});