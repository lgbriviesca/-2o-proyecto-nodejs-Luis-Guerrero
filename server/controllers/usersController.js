const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/usersModel');
const { Restaurant } = require('../models/restaurantsModel');
const { Order } = require('../models/ordersModel');
const { Meal } = require('../models/mealsModel');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

/* const getAllUsers = catchAsync(async (req, res, next) => {

  const users = await User.findAll({
    include: [{ model: Order }],
  });

  res.status(200).json({
    users,
  });
}); */

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

const getOrders = catchAsync(async (req, res, next) => {
  const order = await Order.findAll({
    where: { status: 'active', userId: req.sessionUser.id },
    include: { model: Meal, include: [{ model: Restaurant }] },
  });

  res.status(200).json({
    order,
  });
});

const getOrdersById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, userId: req.sessionUser.id },
    include: { model: Meal, include: [{ model: Restaurant }] },
  });

  if (!order) {
    return next(new AppError('Order with given id does not exist', 403));
  }

  res.status(200).json({
    order,
  });
});

module.exports = {
  /* getAllUsers, */
  createUser,
  updateUser,
  deleteUser,
  login,
  checkToken,
  getOrders,
  getOrdersById,
};
