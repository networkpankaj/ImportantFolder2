const express = require("express");
const userAttendanceController = require("./../controller/userAttendanceController");

const router = express.Router();



router
    .route("/")
    .get(userAttendanceController.getAttendance)
    .post(userAttendanceController.clockIn);

router
    .route("/:id")
    // .get(userAttendanceController.getUserRole)
    .patch(userAttendanceController.clockOut)
// .delete(userAttendanceController.deleteUserRole);


module.exports = router;