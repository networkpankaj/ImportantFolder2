const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const cors = require("cors")
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require("cookie-parser");


//importing router

const userRoute = require("./routes/userRoute");
const departmentRoute = require("./routes/departmentRoute");
const designationRoute = require("./routes/designationRoute");
const userRoleRoute = require("./routes/userRoleRoute");
const userAttendanceRoute = require("./routes/userAttendanceRoute");
const holidayRoute = require("./routes/holidayRoute");
const userLeaveRoute = require("./routes/userLeaveRoute");
const yearlyLeaveRoute = require("./routes/yearlyLeaveRoute");
const attendanceRequestRoute = require("./routes/attendanceRequestRoute");

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Enable sending cookies across domains
}))
//security http header
app.use(helmet())

// prevent no sql injections 
app.use(mongoSanitize());

//development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//serving static files
app.use(express.static(`${__dirname}/public`));

// creating own middleware
app.use((req, res, next) => {
    console.log(`Time: ${Date.now()}⌛`);
    console.log(req.cookies); //to see the cookies sent by client side
    // console.log(req.headers)
    next();
})


app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin/department', departmentRoute);
app.use('/api/v1/admin/designation', designationRoute);
app.use('/api/v1/admin/role', userRoleRoute);
app.use('/api/v1/attendance', userAttendanceRoute);
app.use('/api/v1/admin/holiday', holidayRoute);
app.use('/api/v1/admin/leave', userLeaveRoute);
app.use('/api/v1/admin/yearlyLeave', yearlyLeaveRoute);
app.use('/api/v1/attendance-request', attendanceRequestRoute);


//unhandled router
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404)); //by passing anything in next it skip all other middleware and send the data to global  error handler
})

//global error handling  middleware
app.use(globalErrorHandler)

module.exports = app;


