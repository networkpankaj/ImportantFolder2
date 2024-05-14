const express = require("express");
const designationController = require("./../controller/designationController");

const router = express.Router();



router
    .route("/")
    .get(designationController.getAllDesignation)
    .post(designationController.createDesignation);

router
    .route("/:id")
    .get(designationController.getDesignation)
    .patch(designationController.updateDesignation)
    .delete(designationController.deleteDesignation);

router
    .route("/:id/activate")
    .patch(designationController.activateDesignation);



module.exports = router;