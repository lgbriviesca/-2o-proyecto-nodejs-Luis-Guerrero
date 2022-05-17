const { Restaurant } = require('../models/restaurantsModel');

const restaurantExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({ where: { id } });

    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'No restaurant found',
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { restaurantExists };
