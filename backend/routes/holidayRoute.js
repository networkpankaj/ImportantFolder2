const express = require("express");
const holidayController = require("./../controller/holidayController");
// const authController = require("./../controller/authController")


const router = express.Router();



router
    .route("/")
    // .get(authController.protect, holidayController.getAllUser)
    .get(holidayController.getAllHoliday)
    .post(holidayController.createHoliday);

router
    .route("/:id")
    .get(holidayController.getHoliday)
    .patch(holidayController.updateHoliday)
    .delete(holidayController.deleteHoliday);

router
    .route("/:id/activate")
    .patch(holidayController.activateHoliday);



module.exports = router;