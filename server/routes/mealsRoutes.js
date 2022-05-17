const express = require('express');

const { restaurantExists } = require('../middlewares/restaurantsMiddlewares');
const {
  protectToken,
  protectAdmin,
} = require('../middlewares/usersMiddlewares');

const {
  createMealValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const { mealExists } = require('../middlewares/mealMiddlewares');

const {
  getAllMeats,
  createMeal,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/mealsController');

const router = express.Router();

router.get('/', getAllMeats);

router.get('/:id', mealExists, getMealById);

router.use(protectToken);

router.post(
  '/:id',
  restaurantExists,
  protectAdmin,
  createMealValidations,
  checkValidations,
  createMeal
);

router
  .use('/:id', mealExists)
  .route('/:id')
  .patch(protectAdmin, updateMeal)
  .delete(protectAdmin, deleteMeal);

module.exports = { mealsRouter: router };
