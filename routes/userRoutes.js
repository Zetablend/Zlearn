// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {  adminRegisterValidation,
  mentorRegisterValidation,
  userRegisterValidation,
  loginValidation,changePasswordValidation,resetPasswordValidation } = require('../middlewares/validateMiddleware');
const validate = require('../middlewares/validation');
const verifyToken = require("../middlewares/auth");
const userController  = require('../controllers/User/userRegristration');
const loginController= require('../controllers/User/userLogin');
const resetController= require('../controllers/User/userResetpassword');



router.post('/register', userRegisterValidation, validate, userController.userRegister);
router.post('/login', loginValidation, validate, loginController.loginUser);
router.post('/change-password', verifyToken,changePasswordValidation,validate,loginController.changePassword);
router.post("/forgot-password", resetPasswordValidation,validate, resetController.forgotPassword);
router.post("/reset-password/:token", resetController.resetPassword);
router.post("/upload-video", userController.uploadintodructionVideo);

module.exports = router;
