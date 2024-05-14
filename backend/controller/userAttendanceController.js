const Attendance = require("./../models/userAttendanceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


exports.clockIn = catchAsync(async (req, res, next) => {
    const { userID } = req.body;

    // Create a new Attendance document with the provided userID
    const attendance = await Attendance.create({ userID });

    res.status(201).json({
        status: 'success',
        data: {
            attendance,
            isClockedIn: true
        }
    });
});

exports.clockOut = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const attendance = await Attendance.findOne({ _id: id, status: 1 });
    if (!attendance) {
        return next(new AppError('Attendance record not found', 404));
    }
    // Get the clockInTime and clockOutTime as Date objects
    const clockInTime = new Date(attendance.clockInTime)
    // const clockOutTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    // Calculate IST time by adding the IST offset to UTC time
    const clockOutTime = new Date(new Date().getTime() + istOffset);

    // Calculate the difference in milliseconds
    const timeDifferenceMs = clockOutTime - clockInTime;

    // Calculate hours and minutes
    const millisecondsPerHour = 1000 * 60 * 60;
    const millisecondsPerMinute = 1000 * 60;

    // Calculate hours and minutes from the time difference
    const hours = Math.floor(timeDifferenceMs / millisecondsPerHour);
    const remainingMilliseconds = timeDifferenceMs % millisecondsPerHour;
    const minutes = Math.round(remainingMilliseconds / millisecondsPerMinute);

    // Construct the formatted time string
    const workingHour = `${hours}.${minutes}`;
    // console.log(workingHour)

    const updatedAttendance = await Attendance.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if department is active (status: 1)
        {
            clockOutTime: clockOutTime,
            workingHour: workingHour,
            isClockedIn: false
        }, // Update departmentName
        { new: true, runValidators: true }
    ).select('-updatedAt -status -__v');

    if (!updatedAttendance) {
        // If department is not found or already inactive, return 404 error
        return next(new AppError('Attendance not found', 404));
    }

    res.status(200)
        .json({
            status: "success",
            data: {
                updatedAttendance
            }
        });
})

exports.getAttendance = catchAsync(async (req, res, next) => {
    const { userID, isClockedIn, startDate, endDate } = req.query;

    // Prepare the query object with default filters
    const queryObj = {};

    // Filter by userID if provided
    if (userID) {
        queryObj.userID = userID;
    }

    // Filter by isClockedIn if provided
    if (isClockedIn !== undefined) {
        queryObj.isClockedIn = parseInt(isClockedIn); // Convert to integer
    }

    // Filter by custom date range if startDate and endDate are provided
    if (startDate && endDate) {
        // Adjust startDate to be the start of the day in local time
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);

        // Adjust endDate to be the end of the day in local time
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Add $and operator to ensure all conditions are met
        queryObj.clockInTime = {
            $gte: startOfDay, // Greater than or equal to start of startDate
            $lte: endOfDay    // Less than or equal to end of endDate
        };
    }

    const attendance = await Attendance.find(queryObj).select('-updatedAt -__v');

    res.status(200).json({
        status: "success",
        result: attendance.length,
        data: {
            attendance
        }
    });
});
