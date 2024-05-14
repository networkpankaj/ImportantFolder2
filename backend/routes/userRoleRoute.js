const express = require("express");
const userRoleController = require("./../controller/userRoleController");

const router = express.Router();



router
    .route("/")
    .get(userRoleController.getAllUserRole)
    .post(userRoleController.createUserRole);

router
    .route("/:id")
    .get(userRoleController.getUserRole)
    .patch(userRoleController.updateUserRole)
    .delete(userRoleController.deleteUserRole);

router
    .route("/:id/activate")
    .patch(userRoleController.activateUserRole);



module.exports = router;