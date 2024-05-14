const { promisify } = require("util");
const User = require("./../models/userModel");
const Role = require("./../models/userRoleModel");
const Login = require("./../models/loginModel");
const catchAsync = require("../utils/catchAsync");
const crypto = require('crypto');
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");

// // Function to generate a random token
// const generateRandomToken = (length) => {
//     return crypto.randomBytes(length).toString('hex') + Date.now();
// };

const generateJwtToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res, role, currentUserCode) => {
    const token = generateJwtToken(user._id);
    // setting a cookies

    const cookiesOption = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === "production") {
        cookiesOption.secure = true
    }

    try {
        res.cookie('jwt', token, cookiesOption);
        res.status(statusCode).json({
            status: 'success',
            token,
            role,
            currentUserCode,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Error setting cookie:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to set cookie'
        });
    }
}

exports.createLogin = catchAsync(async (req, res, next) => {

    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ error: 'Token not provided' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');


    // Find the user by token
    const user = await User.findOne({ token: hashedToken });

    if (!user) {
        return next(new AppError('User not found. Invalid token', 404));
    }



    // // Retrieve userCode from the user document
    // req.body.userCode = user.userCode;

    // Create a new login

    const login = await Login.create({
        userCode: user.userCode,
        userEmail: user.userEmail,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,

    })

    console.log(login)
    // Update the user document with the new token and set token to undefined
    user.token = undefined;
    user.status = 1
    // Save the updated user document
    await user.save();

    createSendToken(user, 200, res);

    // const jwtToken = generateJwtToken(login._id);

    // res.status(200)
    //     .json({
    //         jwtToken,
    //         status: "success",
    //         message: "login successful"
    //     });

})

exports.login = catchAsync(async (req, res, next) => {
    const { userEmail, password } = req.body;
    //email pass exist
    if (!userEmail || !password) {
        return next(new AppError('Please provide email and password', 404));
    }

    //user exist and pass correct
    const user = await Login.findOne({ userEmail }).select('+password');

    //calling function to compare pass created in login model

    if (!user || !(await user.isPasswordMatch(password, user.password))) {
        return next(new AppError('Incorrect Email or password', 401));
    }



    //checking the role of the user behalf of the id
    let roleId = user.role;
    let userCode = user.userCode;
    console.log(userCode)
    const searchRole = await Role.findOne({ "_id": roleId });
    const searchUserCode = await User.findOne({ "userCode": userCode });
    const userRole = searchRole.userRoleName;
    const currentUserCode = searchUserCode._id;
    // console.log(currentUserCode)



    // Remove sensitive data (password) from the user object
    user.password = undefined;


    //everything ok
    createSendToken(user, 200, res, userRole, currentUserCode);
    // const jwtToken = generateJwtToken(user._id);;
    // res.status(200)
    //     .json({
    //         jwtToken,
    //         status: "success",
    //         role: userRole,
    //         // message: login
    //     });
})
exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: "success",
        message: 'Logout Successfully !'
    });
}

exports.protect = catchAsync(async (req, res, next) => {
    //get the token and check exist or not
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        // console.log("cookie found" + req.cookies.jwt);
        token = req.cookies.jwt;
    }
    // console.log("", token);

    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access", 401))
    }
    //validate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    //check if user still exist
    // const currentUser = Login.findById(decoded.id)
    const currentUser = await Login.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError("The user belonging to this token does no longer exist ",
                401
            )
        )
    }

    //check if user change pass after the jwt issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password! Please log in again.", 401));
    }


    // Attach the user to the request object for further middleware or route handlers
    req.user = currentUser;

    next()
})
exports.isLockedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        //validate the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // console.log(decoded);

        //check if user still exist
        const currentUser = await Login.findById(decoded.id);

        if (!currentUser) {
            return next()

        }

        // there is a logged in user

        res.user = currentUser
        // console.log(currentUser)
        // req.user = currentUser;


        return next()
    }
    next()
})


// restricted route

exports.restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        //checking the role of the user behalf of the id
        let roleId = req.user.role;
        const searchRole = await Role.findOne({ "_id": roleId });
        const userRole = searchRole.userRoleName;

        if (!roles.includes(userRole.toString())) {
            return next(new AppError("You do not have the Permission", 403))
        }
        next();
    })


}


//forgot pass request
exports.forgotPassword = catchAsync(async (req, res, next) => {
    //get user based on email
    const user = await Login.findOne({ userEmail: req.body.email });
    if (!user) {
        return next(new AppError("There is no user with Email address", 404))
    }
    //generate token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })


    //send it to user's email

    // Send email to the user
    const userEmail = user.userEmail; // Assuming user email is stored in 'email' field
    const subject = 'Welcome to Our Website';

    const redirectUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/resetPassword/${resetToken}`;

    const message = `Hi ${user.userName},\n\nWe received Forgot password request.\n\nPlease click on the following link to reset your password:\n\n${redirectUrl}`;

    try {
        await sendEmail(userEmail, subject, message);
        res.status(200)
            .json({
                status: "success",
                message: 'Forgot token sent to email !'
            });
    } catch (err) {
        user.token = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false })
        // return next(new AppError(err, 500))
        return next(new AppError("There was an error sending the email. Try again later", 500))
    }

})

//reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
    //get user based on token
    // console.log(req.params.token)
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // console.log(hashedToken);

    const user = await Login.findOne({
        token: hashedToken,
        passwordResetExpire: { $gt: Date.now() }
    });

    // console.log(user);
    //if token has no expired and there is user, set the new pass
    if (!user) {
        return next(new AppError("Token is invalid or has expired", 400))
    }
    user.password = req.body.password,
        user.passwordConfirm = req.body.passwordConfirm,

        user.token = undefined;
    user.passwordResetExpire = undefined;

    await user.save();

    // update pass

    //login the user in ,send jwt

    createSendToken(user, 200, res);
    // const jwtToken = generateJwtToken(user._id);
    // res.status(200)
    //     .json({
    //         jwtToken,
    //         status: "success",
    //         message: "password update successfully"
    //     });



})