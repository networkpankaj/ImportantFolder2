const YearlyLeave = require("./../models/yearlyLeaveModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllYearlyLeave = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const leave = await YearlyLeave.find(queryObj)
        .select('-updatedAt -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            type: typeof (leave),
            result: leave.length,
            data: {
                leave
            }
        });
})

exports.getYearlyLeave = catchAsync(async (req, res, next) => {

    const leave = await YearlyLeave.findById(req.params.id)
        .select('-updatedAt -__v');

    if (!leave) {
        return next(new AppError('leave not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                leave
            }
        });
})

exports.createYearlyLeave = catchAsync(async (req, res, next) => {
    console.log(req.body)

    // Destructure required fields from req.body
    const { userID, leaveType, startDate, endDate, reason } = req.body;


    // Create a new leave document with the provided data
    const leave = await YearlyLeave.create({
        userID,
        leaveType,
        startDate,
        endDate,
        reason,
    });

    res.status(201).json({
        status: 'success',
        data: {
            leave
        }
    });

})


exports.updateYearlyLeave = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const leaveUpdates = req.body; // Assuming req.body contains the updated leave fields

    // Create an object with only the fields you want to update
    const updatedFields = {
        ...leaveUpdates, // Spread the updated fields from req.body
        updatedAt: new Date(), // Optionally update the updatedAt field
    };


    const updatedLeave = await YearlyLeave.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Leave is active (status: 1)
        { $set: updatedFields }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedLeave) {
        // If leave is not found or already inactive, return 404 error
        return next(new AppError('Leave not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                leave: updatedLeave
            }
        });
});




exports.activateYearlyLeave = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedLeave = await YearlyLeave.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if leave is inactive (status: 0)
        { status: 1 }, // Update status to 1 (active)
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedLeave) {
        // If Leave is not found or already active, return 404 error
        return next(new AppError('Leave not found or already active', 404));
    }

    // Send success response with updatedLeave data
    res.status(200).json({
        status: 'success',
        data: {
            leave: updatedLeave
        }
    });

})



exports.deleteYearlyLeave = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedLeave = await YearlyLeave.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Leave is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedLeave) {
        // If Leave is not found or already inactive, return 404 error
        return next(new AppError('Leave not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})