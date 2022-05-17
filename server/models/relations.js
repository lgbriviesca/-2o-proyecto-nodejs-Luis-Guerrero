const { Meal } = require('./mealsModel');
const { Order } = require('./ordersModel');
const { Restaurant } = require('./restaurantsModel.js');
const { Review } = require('./reviewsModel.js');
const { User } = require('./usersModel.js');

const initRelations = () => {
  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  User.hasMany(Review);
  Review.belongsTo(User);

  User.hasOne(Order);
  Order.belongsTo(User);

  Meal.hasOne(Order);
  Order.belongsTo(Meal);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);
};

module.exports = { initRelations };
