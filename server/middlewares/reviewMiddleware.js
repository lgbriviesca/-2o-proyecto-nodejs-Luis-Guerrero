const { Review } = require('../models/reviewsModel');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectReviewAccountOwner = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await Review.findOne({
    where: { userId: sessionUser.id },
  });

  if (!user) {
    return next(
      new AppError('Only the author of the review can do this action', 404)
    );
  }

  next();
});

module.exports = { protectReviewAccountOwner };
