const express = require("express");
const userAttendanceRequestController = require("./../controller/userAttendanceRequestController");

const router = express.Router();



router
    .route("/")
    .get(userAttendanceRequestController.getAllAttendanceRequest)
    .post(userAttendanceRequestController.createAttendanceRequest);

router
    .route("/:id")
    .get(userAttendanceRequestController.getAttendanceRequest)
    .patch(userAttendanceRequestController.updateAttendanceRequest)
    .delete(userAttendanceRequestController.deleteAttendanceRequest);

router
    .route("/:id/activate")
    .patch(userAttendanceRequestController.activateAttendanceRequest);

// router
//     .route("/:id/updateStage")
//     .patch(userAttendanceRequestController.updateLeaveStage);



module.exports = router;