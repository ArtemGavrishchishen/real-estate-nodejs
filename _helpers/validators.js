const { body } = require('express-validator');
const User = require('../models/user');
const role = require('./role');
const type = require('./type-estate');

exports.registerValidators = [
  body('role')
    .isIn([role.customer, role.seller])
    .withMessage('Choose correct role: Customer or Seller')
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name should be at least 3 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Enter correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (user) {
          return Promise.reject('User with such email is already exist');
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail()
    .trim(),
  body('password', 'Password should be at least 6 characters')
    .isLength({ min: 6, max: 26 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords should match');
      }
      return true;
    })
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter correct email')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (!user) {
          return Promise.reject("There's no such user");
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    })
    .trim(),
  body('password', 'Password should be at least 6 characters')
    .isLength({ min: 6, max: 26 })
    .isAlphanumeric()
    .trim(),
];

exports.realtyValidators = [
  body('type')
    .isIn([type.rentals, type.sales])
    .withMessage('Choose correct type: Rentals or Sales')
    .trim(),
  body('title')
    .isLength({ min: 1 })
    .withMessage('Please, enter the title')
    .trim(),
  body('address')
    .isLength({ min: 1 })
    .withMessage('Please, enter the Address')
    .trim(),
  body('floor').isNumeric().withMessage('Enter the correct floor').trim(),
  body('rooms').isNumeric().withMessage('Enter the correct rooms').trim(),
  body('square').isNumeric().withMessage('Enter the correct square').trim(),
  body('price').isNumeric().withMessage('Enter the correct price').trim(),
  body('description')
    .isLength({ max: 250 })
    .withMessage('Description must be no more than 250 characters')
    .trim(),
];

exports.passwordValidators = [
  body('password', 'Password should be at least 6 characters')
    .isLength({ min: 6, max: 26 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords should match');
      }
      return true;
    })
    .trim(),
];

exports.emailValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter correct email')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (!user) {
          return Promise.reject("There's no such user");
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    })
    .trim(),
];

exports.contactValidators = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name should be at least 3 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Enter correct email')
    .normalizeEmail()
    .trim(),
  body('description')
    .isLength({ max: 250 })
    .withMessage('Description must be no more than 250 characters')
    .trim(),
];
