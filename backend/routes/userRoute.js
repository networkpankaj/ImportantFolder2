const express = require("express");
const userController = require("./../controller/userController");
const authController = require("./../controller/authController")


const router = express.Router();




router.post('/signup/:token', authController.createLogin)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)


// _____________________Personal Details_______________________________//
router.use(authController.isLockedIn)

router
    .route("/personal-details")
    .get(userController.getUserPersonalDetails)
    .post(userController.createUserPersonalDetails)
    .patch(userController.updateUserPersonalDetails)

// _____________________Official Details_______________________________//

router
    .route("/official-details")
    .get(userController.getUserOfficialDetails)
    .post(userController.createUserOfficialDetails)
    .patch(userController.updateUserOfficialDetails)

// _____________________user Details___________________________________//

router
    .route("/")
    .get(authController.protect, authController.isLockedIn, userController.getAllUser)
    // .get(userController.getAllUser)
    .post(authController.protect, userController.createUser);

router
    .route("/:id")
    .get(authController.protect, userController.getUser)
    .patch(authController.protect, userController.updateUser)
    // .delete(
    // userController.deleteUser);
    .delete(authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser);





// _____________________Activate User_______________________________//

router
    .route("/:id/activate")
    .patch(userController.activateUser);



module.exports = router;