const Review = require('./../models/reviewModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const factory = require('../controllers/handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourID) filter.tour = req.params.tourID;
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found', 404));
  }
  res.status(200).json({
    staus: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
