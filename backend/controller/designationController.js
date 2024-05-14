const Designation = require("./../models/designationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllDesignation = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const designation = await Designation.find(queryObj)
        .select('-updatedAt -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            result: designation.length,
            data: {
                designation
            }
        });
})

exports.getDesignation = catchAsync(async (req, res, next) => {

    const designation = await Designation.findById(req.params.id)
        .select('-updatedAt -__v');

    if (!designation || designation.status === 0) {
        return next(new AppError('designation not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                designation
            }
        });
})

exports.createDesignation = catchAsync(async (req, res, next) => {

    const designation = await Designation.create(req.body)
    const { updatedAt, status, __v, ...filteredDesignation } = designation.toObject();
    res.status(200)
        .json({
            status: "success",
            data: {
                designation: filteredDesignation
            }
        });

})


exports.updateDesignation = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { designationName } = req.body;
    const updatedDesignation = await Designation.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if designation is active (status: 1)
        { designationName }, // Update designationName
        { new: true, runValidators: true }
    ).select('-updatedAt  -__v');

    if (!updatedDesignation) {
        // If designation is not found or already inactive, return 404 error
        return next(new AppError('Designation not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                updatedDesignation
            }
        });
});




exports.activateDesignation = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedDesignation = await Designation.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if designation is active (status: 1)
        { status: 1 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedDesignation) {
        // If designation is not found or already inactive, return 404 error
        return next(new AppError('Designation not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                updatedDesignation
            }
        });

})

exports.deleteDesignation = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedDesignation = await Designation.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if designation is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedDesignation) {
        // If designation is not found or already inactive, return 404 error
        return next(new AppError('Designation not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})