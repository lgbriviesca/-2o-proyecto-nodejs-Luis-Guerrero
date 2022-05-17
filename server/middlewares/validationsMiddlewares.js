const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');

const createUserValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const createRestaurantValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('adress').notEmpty().withMessage('adress cannot be empty'),
  body('rating')
    .notEmpty()
    .withMessage('Rating cannot be empty')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

const createMealValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isNumeric()
    .withMessage('Price must be a number'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }
  next();
};

module.exports = {
  createUserValidations,
  createRestaurantValidations,
  createMealValidations,
  checkValidations,
};
