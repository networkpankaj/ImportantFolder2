const express = require("express");
const yearlyLeaveController = require("./../controller/yearlyLeaveController");

const router = express.Router();



router
    .route("/")
    .get(yearlyLeaveController.getAllYearlyLeave)
    .post(yearlyLeaveController.createYearlyLeave);

router
    .route("/:id")
    .get(yearlyLeaveController.getYearlyLeave)
    .patch(yearlyLeaveController.updateYearlyLeave)
    .delete(yearlyLeaveController.deleteYearlyLeave);

router
    .route("/:id/activate")
    .patch(yearlyLeaveController.activateYearlyLeave);
// router
//     .route("/:id/updateStage")
//     .patch(yearlyLeaveController.updateYearlyLeaveStage);



module.exports = router;