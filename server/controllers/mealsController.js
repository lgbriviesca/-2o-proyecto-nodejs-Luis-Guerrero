const { Restaurant } = require('../models/restaurantsModel');
const { Meal } = require('../models/mealsModel');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllMeats = catchAsync(async (req, res, next) => {
  const meal = await Meal.findAll({
    where: { status: 'active' },
    include: [{ model: Restaurant }],
  });

  res.status(200).json({
    meal,
  });
});

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({ newMeal });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const mealById = await Meal.findOne({
    where: { id, status: 'active' },
    include: [{ model: Restaurant }],
  });

  if (!mealById) {
    return next(new AppError('Meal with given id does not exist', 403));
  }

  res.status(200).json({ mealById });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const mealToUpdate = await Meal.findOne({ where: { id } });

  await mealToUpdate.update({ name, price });

  res.status(200).json({ status: 'succes' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const mealToUpdate = await Meal.findOne({ where: { id } });

  await mealToUpdate.update({ status: 'deleted' });

  res.status(200).json({ status: 'succes' });
});

module.exports = {
  getAllMeats,
  createMeal,
  getMealById,
  updateMeal,
  deleteMeal,
};
