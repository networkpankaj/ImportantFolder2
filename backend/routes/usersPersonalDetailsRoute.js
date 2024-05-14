const express = require("express");
const userPersonalDetailsController = require("./../controller/userPersonalDetailsController");
const authController = require("./../controller/authController")


const router = express.Router();


router
    .route("/")
    .get(userPersonalDetailsController.getAllUserPersonalDetails)
    .post(userPersonalDetailsController.createUserPersonalDetails);

router
    .route("/:id")
    .get(userPersonalDetailsController.getUserPersonalDetails)
    .patch(userPersonalDetailsController.updateUserPersonalDetails)
    .delete(
        userPersonalDetailsController.deleteUserPersonalDetails);
// .delete(authController.protect,
//     authController.restrictTo('admin'),
//     userPersonalDetailsController.deleteUser);

router
    .route("/:id/activate")
    .patch(userPersonalDetailsController.activateUserPersonalDetails);



module.exports = router;