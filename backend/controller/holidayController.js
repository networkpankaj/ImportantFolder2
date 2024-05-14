const Holiday = require("./../models/holidayModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllHoliday = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const holiday = await Holiday.find(queryObj)
        .select('-updatedAt -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            type: typeof (holiday),
            result: holiday.length,
            data: {
                holiday
            }
        });
})

exports.getHoliday = catchAsync(async (req, res, next) => {

    const holiday = await Holiday.findById(req.params.id)
        .select('-updatedAt -__v');

    if (!holiday) {
        return next(new AppError('holiday not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                holiday
            }
        });
})

exports.createHoliday = catchAsync(async (req, res, next) => {

    const holiday = await Holiday.create(req.body)
    const { updatedAt, __v, ...filteredHoliday } = holiday.toObject();


    res.status(200)
        .json({
            status: "success",
            data: {
                holiday: filteredHoliday
            }
        });

})


exports.updateHoliday = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { holidayName } = req.body;

    const updatedHoliday = await Holiday.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Holiday is active (status: 1)
        { holidayName }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedHoliday) {
        // If holiday is not found or already inactive, return 404 error
        return next(new AppError('Holiday not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                holiday: updatedHoliday
            }
        });
});




exports.activateHoliday = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedHoliday = await Holiday.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if Holiday is inactive (status: 0)
        { status: 1 }, // Update status to 1 (active)
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedHoliday) {
        // If Holiday is not found or already active, return 404 error
        return next(new AppError('Holiday not found or already active', 404));
    }

    // Send success response with updatedHoliday data
    res.status(200).json({
        status: 'success',
        data: {
            holiday: updatedHoliday
        }
    });

})

exports.deleteHoliday = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedHoliday = await Holiday.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Holiday is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedHoliday) {
        // If Holiday is not found or already inactive, return 404 error
        return next(new AppError('Holiday not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})