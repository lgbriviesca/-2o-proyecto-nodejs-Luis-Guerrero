const express = require('express');
const { body } = require('express-validator');

const { restaurantExists } = require('../middlewares/restaurantsMiddlewares');
const {
  protectReviewAccountOwner,
} = require('../middlewares/reviewMiddleware');
const {
  protectToken,
  protectAdmin,
} = require('../middlewares/usersMiddlewares');

const {
  createRestaurantValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReviewInRestaurant,
  updateReviewInRestaurant,
  deleteReviewInRestaurant,
} = require('../controllers/restaurantsController');

const router = express.Router();

router
  .get('/', getAllRestaurants)
  .get('/:id', restaurantExists, getRestaurantById);

router.use(protectToken);

router.post(
  '/',
  protectAdmin,
  createRestaurantValidations,
  checkValidations,
  createRestaurant
);

router
  .route('/reviews/:id')
  .post(createReviewInRestaurant)
  .patch(protectReviewAccountOwner, updateReviewInRestaurant)
  .delete(protectReviewAccountOwner, deleteReviewInRestaurant);

router
  .use('/:id', restaurantExists)
  .route('/:id')
  .patch(protectAdmin, updateRestaurant)
  .delete(protectAdmin, deleteRestaurant);

module.exports = { restaurantsRouter: router };
