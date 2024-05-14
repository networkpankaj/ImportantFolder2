const Department = require("./../models/departmentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllDepartment = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const department = await Department.find(queryObj)
        .select('-updatedAt -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            type: typeof (department),
            result: department.length,
            data: {
                department
            }
        });
})

exports.getDepartment = catchAsync(async (req, res, next) => {

    const department = await Department.findById(req.params.id)
        .select('-updatedAt -__v');

    if (!department) {
        return next(new AppError('department not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                department
            }
        });
})

exports.createDepartment = catchAsync(async (req, res, next) => {

    const department = await Department.create(req.body)
    const { updatedAt, __v, ...filteredDepartment } = department.toObject();


    res.status(200)
        .json({
            status: "success",
            data: {
                department: filteredDepartment
            }
        });

})


exports.updateDepartment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { departmentName } = req.body;

    const updatedDepartment = await Department.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Department is active (status: 1)
        { departmentName }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
        // If department is not found or already inactive, return 404 error
        return next(new AppError('Department not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                department: updatedDepartment
            }
        });
});




exports.activateDepartment = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedDepartment = await Department.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if Department is inactive (status: 0)
        { status: 1 }, // Update status to 1 (active)
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedDepartment) {
        // If Department is not found or already active, return 404 error
        return next(new AppError('Department not found or already active', 404));
    }

    // Send success response with updatedDepartment data
    res.status(200).json({
        status: 'success',
        data: {
            department: updatedDepartment
        }
    });

})

exports.deleteDepartment = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedDepartment = await Department.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Department is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
        // If Department is not found or already inactive, return 404 error
        return next(new AppError('Department not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})