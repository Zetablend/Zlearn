const { body } = require('express-validator');

const { Admin, Mentor, User } = require('../models');

const checkUnique = (model, field, msg) => {
  return body(field)
    .custom(async (value) => {
      const where = {};
      where[field] = value;
      const exists = await model.findOne({ where });
      if (exists) throw new Error(msg);
      return true;
    });
};

// Common fields
const baseValidation = [
  body('firstName').notEmpty().withMessage('firstName is required'),
   body('lastName').notEmpty().withMessage('lastName is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Admin Registration
const adminRegisterValidation = [
  ...baseValidation,
  checkUnique(Admin, 'email', 'Email already registered'),
  checkUnique(Admin, 'phone', 'Phone already registered')
];

// Mentor Registration
const mentorDocumentValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('full_name').notEmpty().withMessage('full name is required'),
  checkUnique(Mentor, 'email', 'Email already registered'),
  checkUnique(Mentor, 'phone', 'Phone already registered'),
];

const mentorRegisterValidation = [
  ...mentorDocumentValidation,
  body('phone_number').isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
];

// User Registration
const userRegisterValidation = [
  ...baseValidation,
  checkUnique(User, 'email', 'Email already registered'),
  checkUnique(User, 'phone', 'Phone already registered')
];

// Common login validation
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body("id").notEmpty().withMessage("User ID is required"),
  body("currentpassword").notEmpty().withMessage("Current password is required"),
  body("Newpassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  body("confirmpassword").notEmpty().withMessage("Confirm password is required"),
];
const resetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  checkUnique(User, 'email', 'Email not found'),
];
const sessionvalidation=[
  body('date').notEmpty().withMessage('Date is required'),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in 24-hour HH:mm format'),
  body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in 24-hour HH:mm format'),
  body('goal').notEmpty().withMessage('goal is required'),
  body('batchId').notEmpty().withMessage('Batch ID is required'),
]


module.exports = {
  adminRegisterValidation,
  mentorRegisterValidation,
  userRegisterValidation,
  loginValidation,
  changePasswordValidation,
  resetPasswordValidation,
  mentorDocumentValidation,
  sessionvalidation
};
