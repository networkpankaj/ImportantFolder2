const express = require("express");
const departmentController = require("./../controller/departmentController");


const router = express.Router();



router
    .route("/")
    // .get(authController.protect, departmentController.getAllDepartment)
    .get(departmentController.getAllDepartment)
    .post(departmentController.createDepartment);

router
    .route("/:id")
    .get(departmentController.getDepartment)
    .patch(departmentController.updateDepartment)
    .delete(departmentController.deleteDepartment);

router
    .route("/:id/activate")
    .patch(departmentController.activateDepartment);



module.exports = router;