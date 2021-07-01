const Tour = require('../models/tourModel');
const catchAsync = require('../Utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // Get tour data from collection
  const tours = await Tour.find();
  // Build template
  //render that template using tour data form 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //get the data for requested tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  //build template
  //render the template using data from 1
  res.status(200).render('tour', {
    tour,
  });
});
