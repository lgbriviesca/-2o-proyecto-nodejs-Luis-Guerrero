const { Restaurant } = require('../models/restaurantsModel');
const { Review } = require('../models/reviewsModel');

const { catchAsync } = require('../utils/catchAsync');

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
    include: [{ model: Review }],
  });

  res.status(200).json({
    restaurants,
  });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, adress, rating } = req.body;

  const newRestaurant = await Restaurant.create({ name, adress, rating });

  res.status(201).json({ newRestaurant });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id },
    include: [{ model: Review }],
  });

  res.status(200).json({
    restaurant,
  });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, adress } = req.body;

  const restaurant = await Restaurant.findOne({ where: { id } });

  await restaurant.update({ name, adress });

  res.status(200).json({ status: 'success' });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({ where: { id } });

  await restaurant.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

const createReviewInRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  const { sessionUser } = req;

  const review = await Review.create({
    comment,
    rating,
    restaurantId: id,
    userId: sessionUser.id,
  });

  res.status(200).json({ review });
});

const updateReviewInRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  console.log('hola');

  const review = await Review.findOne({
    where: { restaurantId: id },
  });

  await review.update({ comment, rating });

  res.status(200).json({ status: 'success' });
});

const deleteReviewInRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({ where: { restaurantId: id } });

  await review.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReviewInRestaurant,
  updateReviewInRestaurant,
  deleteReviewInRestaurant,
};
