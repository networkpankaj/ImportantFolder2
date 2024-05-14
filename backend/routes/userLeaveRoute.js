const express = require("express");
const userLeaveController = require("./../controller/userLeaveController");

const router = express.Router();



router
    .route("/")
    .get(userLeaveController.getAllLeave)
    .post(userLeaveController.createLeave);

router
    .route("/:id")
    .get(userLeaveController.getLeave)
    .patch(userLeaveController.updateLeave)
    .delete(userLeaveController.deleteLeave);

router
    .route("/:id/activate")
    .patch(userLeaveController.activateLeave);
router
    .route("/:id/updateStage")
    .patch(userLeaveController.updateLeaveStage);



module.exports = router;