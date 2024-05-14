const Leave = require("./../models/leaveModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getAllLeave = catchAsync(async (req, res, next) => {
    const { userID} = req.query;

    // Prepare the query object with default filters
    const queryObj = {};

    // Filter by userID if provided
    if (userID) {
        queryObj.userID = userID;
    }
    // const queryObj = { ...req.query };
    const leave = await Leave.find(queryObj)
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

exports.getLeave = catchAsync(async (req, res, next) => {

    const leave = await Leave.findById(req.params.id)
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

// exports.createLeave = catchAsync(async (req, res, next) => {
//     console.log(req.body)

//     // Destructure required fields from req.body
//     const { userID, leaveType, startDate, endDate, reason } = req.body;

//     // Check if there's any overlapping leave request for the same user and date range
//     const existingLeave = await Leave.findOne({
//         userID,
//         $or: [
//             {
//                 startDate: { $lte: new Date(startDate) },
//                 endDate: { $gte: new Date(startDate) }
//             },
//             {
//                 startDate: { $lte: new Date(endDate) },
//                 endDate: { $gte: new Date(endDate) }
//             },
//             {
//                 startDate: { $gte: new Date(startDate) },
//                 endDate: { $lte: new Date(endDate) }
//             }
//         ]
//     });

//     if (existingLeave) {

//         return next(new AppError('Leave request conflicts with an existing leave request', 400));
//     }


//     // Create a new leave document with the provided data
//     const leave = await Leave.create({
//         userID,
//         leaveType,
//         startDate,
//         endDate,
//         reason,
//     });

//     res.status(201).json({
//         status: 'success',
//         data: {
//             leave
//         }
//     });

// })
exports.createLeave = catchAsync(async (req, res, next) => {
    // console.log(req.body)

    // Destructure required fields from req.body
    const { userID, leaveType, startDate, endDate, reason } = req.body;

    // Check if there's any overlapping leave request for the same user and date range
    const existingLeave = await Leave.findOne({
        userID,
        $or: [
            {
                startDate: { $lte: new Date(startDate) },
                endDate: { $gte: new Date(startDate) }
            },
            {
                startDate: { $lte: new Date(endDate) },
                endDate: { $gte: new Date(endDate) }
            },
            {
                startDate: { $gte: new Date(startDate) },
                endDate: { $lte: new Date(endDate) }
            }
        ]
    });

    if (existingLeave) {

        return next(new AppError('Leave request conflicts with an existing leave request', 400));
    }

    // Fetch active holidays from the holiday endpoint
    const holidayResponse = await fetch('http://localhost:3000/api/v1/admin/holiday?status=1');
    if (!holidayResponse.ok) {
        throw new Error('Failed to fetch holidays');
    }

    const { data: { holiday: activeHolidays } } = await holidayResponse.json();

    // Check if the selected leave period overlaps with any active holidays
    const isHolidayConflict = activeHolidays.some(holiday => {
        const holidayStartDate = new Date(holiday.holidayDate);
        const holidayEndDate = new Date(holiday.holidayDate);

        // Check for overlap between holiday and leave period
        const overlap = !(
            holidayEndDate < new Date(startDate) ||
            holidayStartDate > new Date(endDate)
        );

        return overlap;
    });

    if (isHolidayConflict) {
        return next(new AppError('Leave request conflicts with a holiday', 400));
    }



    // Create a new leave document with the provided data
    const leave = await Leave.create({
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


exports.updateLeave = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const leaveUpdates = req.body; // Assuming req.body contains the updated leave fields

    // Create an object with only the fields you want to update
    const updatedFields = {
        ...leaveUpdates, // Spread the updated fields from req.body
        updatedAt: new Date(), // Optionally update the updatedAt field
    };


    const updatedLeave = await Leave.findOneAndUpdate(
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




exports.activateLeave = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedLeave = await Leave.findOneAndUpdate(
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

exports.updateLeaveStage = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Assuming 'id' is passed in the request parameters
    const { stage } = req.body; // Assuming 'stage' is passed in the request body

    // Ensure stage is a valid number (assuming it's passed in the body)
    if (isNaN(stage) || ![0, 1].includes(parseInt(stage))) {
        return next(new AppError('Invalid stage value', 400));
    }

    const updatedLeave = await Leave.findOneAndUpdate(
        { _id: id, status: 1 }, // Find only if leave is active (status: 1)
        { stage }, // Update the stage field with the provided value
        { new: true, runValidators: true, fields: { stage: 1 } } // Return only the updated stage field
    );

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
});


exports.deleteLeave = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const updatedLeave = await Leave.findOneAndUpdate(
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