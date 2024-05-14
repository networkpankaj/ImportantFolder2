const UserRole = require("./../models/userRoleModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllUserRole = catchAsync(async (req, res, next) => {

    const userRole = await UserRole.find()
        .select('-updatedAt  -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            result: userRole.length,
            data: {
                role: userRole
            }
        });
})

exports.getUserRole = catchAsync(async (req, res, next) => {

    const userRole = await UserRole.findById(req.params.id)
        .select('-updatedAt  -__v');

    if (!userRole) {
        return next(new AppError('User Role not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                role: userRole
            }
        });
})

exports.createUserRole = catchAsync(async (req, res, next) => {

    const userRole = await UserRole.create(req.body)
    const { updatedAt, __v, ...filteredRole } = userRole.toObject();
    res.status(200)
        .json({
            status: "success",
            data: {
                role: filteredRole
            }
        });

})


exports.updateUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userRoleName } = req.body;
    const updatedUserRole = await UserRole.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if userRole is active (status: 1)
        { userRoleName }, // Update userRoleName
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedUserRole) {
        // If role is not found or already inactive, return 404 error
        return next(new AppError('Role not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                role: updatedUserRole
            }
        });
});




exports.activateUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find the user role by id and update its status to active (status: 1)
    const updatedUserRole = await UserRole.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if role is inactive (status: 0)
        { status: 1 }, // Update status to active (status: 1)
        { new: true, runValidators: true } // Return the updated document
    ).select('-updatedAt -__v');

    // Check if the user role was not found or already active
    if (!updatedUserRole) {
        return next(new AppError('Role not found or already active', 404));
    }

    // If the user role was successfully updated, respond with a success message
    res.status(200).json({
        status: 'success',
        data: {
            role: updatedUserRole
        }
    });
});

exports.deleteUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find the user role by id and update its status to 0 (inactive)
    const updatedUserRole = await UserRole.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Department is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    // Check if the user role was not found or already inactive
    if (!updatedUserRole) {
        return next(new AppError('Role not found or already inactive', 404));
    }

    // If the user role was successfully updated, respond with a success message
    res.status(204).json({
        status: 'success',
        data: null
    });
});