const { Restaurant } = require('../models/restaurantsModel');
const { Meal } = require('../models/mealsModel');
const { Order } = require('../models/ordersModel');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { quantity, mealId } = req.body;

  const mealExist = await Meal.findOne({
    where: { id: mealId, status: 'active' },
  });

  if (!mealExist) {
    return next(new AppError('Meal with given id does not exist', 403));
  }

  const price = mealExist.price * quantity;

  const newOrder = await Order.create({
    quantity,
    mealId,
    price,
    userId: sessionUser.id,
  });

  res.status(201).json({ newOrder });
});

const myOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const myOrders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: { model: Meal, include: [{ model: Restaurant }] },
  });

  res.status(201).json({ myOrders });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderToUpdate = await Order.findOne({
    where: { id, status: 'active' },
  });

  if (!orderToUpdate) {
    return next(
      new AppError('Order with given id does not exist or is not active', 403)
    );
  }

  await orderToUpdate.update({ status: 'completed' });

  res.status(200).json({ status: 'success' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderToDelete = await Order.findOne({
    where: { id, status: 'active' },
  });

  if (!orderToDelete) {
    return next(new AppError('Order with given id is not active', 403));
  }

  await orderToDelete.update({ status: 'cancelled' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  createOrder,
  myOrders,
  updateOrder,
  deleteOrder,
};
