const AttendanceRequest = require("./../models/attendanceRequestModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllAttendanceRequest = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const attendanceRequest = await AttendanceRequest.find(queryObj)
        .select('-updatedAt -__v'); // Exclude fields from the result

    res.status(200)
        .json({
            status: "success",
            // type: typeof (leave),
            result: attendanceRequest.length,
            data: {
                Request: attendanceRequest
            }
        });
})

exports.getAttendanceRequest = catchAsync(async (req, res, next) => {

    const attendanceRequest = await AttendanceRequest.findById(req.params.id)
        .select('-updatedAt -__v');

    if (!attendanceRequest) {
        return next(new AppError('Request not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                Request: attendanceRequest
            }
        });
})

exports.createAttendanceRequest = catchAsync(async (req, res, next) => {

    const { userID, date, reason } = req.body;
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)

    // Get the current date and time in IST
    const currentDateIST = new Date(new Date().getTime() + ISTOffset);

    // Parse the request date from req.body and convert to IST
    const requestDate = new Date(new Date(date).getTime() + ISTOffset);
    requestDate.setUTCHours(0, 0, 0, 0); // Set time to start of the day in IST

    // Check if the request date is in the future compared to current date in IST
    if (requestDate > currentDateIST) {
        return next(new AppError("Can't request for a future date", 400));
    }




    // Create a new leave document with the provided data
    const attendanceRequest = await AttendanceRequest.create({
        userID,
        date: requestDate,
        reason,
    });

    res.status(201).json({
        status: 'success',
        data: {
            Request: attendanceRequest
        }
    });

})


exports.updateAttendanceRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const attendanceRequestUpdates = req.body; // Assuming req.body contains the updated leave fields

    // Create an object with only the fields you want to update
    const updatedFields = {
        ...attendanceRequestUpdates, // Spread the updated fields from req.body
        updatedAt: new Date(), // Optionally update the updatedAt field
    };


    const updatedAttendanceRequest = await AttendanceRequest.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Leave is active (status: 1)
        { $set: updatedFields }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedAttendanceRequest) {
        // If leave is not found or already inactive, return 404 error
        return next(new AppError('Request not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                Request: updatedAttendanceRequest
            }
        });
});




exports.activateAttendanceRequest = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedAttendanceRequest = await AttendanceRequest.findOneAndUpdate(
        { _id: id, status: 0 }, // Find only if leave is inactive (status: 0)
        { status: 1 }, // Update status to 1 (active)
        { new: true, runValidators: true }
    ).select('-updatedAt -__v');

    if (!updatedAttendanceRequest) {
        // If Leave is not found or already active, return 404 error
        return next(new AppError('Request not found or already active', 404));
    }

    // Send success response with updatedLeave data
    res.status(200).json({
        status: 'success',
        data: {
            Request: updatedAttendanceRequest
        }
    });

})

exports.updateAttendanceRequestStage = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Assuming 'id' is passed in the request parameters
    const { stage } = req.body; // Assuming 'stage' is passed in the request body

    // Ensure stage is a valid number (assuming it's passed in the body)
    if (isNaN(stage) || ![0, 1].includes(parseInt(stage))) {
        return next(new AppError('Invalid stage value', 400));
    }

    const updatedAttendanceRequest = await AttendanceRequest.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if leave is active (status: 1)
        { stage }, // Update the stage field with the provided value
        { new: true, runValidators: true, fields: { stage: 1 } } // Return only the updated stage field
    );

    if (!updatedAttendanceRequest) {
        // If Leave is not found or already active, return 404 error
        return next(new AppError('Attendance Request not found or already active', 404));
    }

    // Send success response with updatedLeave data
    res.status(200).json({
        status: 'success',
        data: {
            leave: AttendanceRequest
        }
    });
});


exports.deleteAttendanceRequest = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedAttendanceRequest = await AttendanceRequest.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if Leave is active (status: 1)
        { status: 0 }, // Update status to 0 (inactive)
        { new: true, runValidators: true }
    );

    if (!updatedAttendanceRequest) {
        // If Leave is not found or already inactive, return 404 error
        return next(new AppError('Request not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

})