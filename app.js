const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);
const reviewRouter = require('./routes/reveiwRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1 Global Middlewares
//set security http headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limiting requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an hour',
});
app.use('/api', limiter);

//Body parser, reading data form body into req.body
app.use(express.json({ limit: '10kb' })); //express.json() is the middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser()); //for taking out token from cookie or parses data from cookie

//data sanitization for NOSQL query injection
app.use(mongoSanitize());

//data sanitization for XSS
app.use(xss());

//preventing parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
    ],
  }),
);

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  // console.log(req.cookies);

  next();
});

//Routes
//using subrouter as middleware

app.use('/', viewRouter); //mounting router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);

  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // next(err);
});

app.use(globalErrorHandler);

module.exports = app;
