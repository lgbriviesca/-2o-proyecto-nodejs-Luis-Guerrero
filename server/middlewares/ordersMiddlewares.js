const { Order } = require('../models/ordersModel');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectOrderAccountOwner = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await Order.findOne({
    where: { userId: sessionUser.id },
  });

  if (!user) {
    return next(
      new AppError('Only the owner of the order can do this action', 404)
    );
  }

  next();
});

module.exports = { protectOrderAccountOwner };
