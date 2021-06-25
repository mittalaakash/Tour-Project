const Review = require('./../models/reviewModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

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

exports.createReview = catchAsync(async (req, res, next) => {
  //allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

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

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(204).json({
    staus: 'success',
    data: null,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {});
