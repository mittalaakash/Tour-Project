const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const factory = require('../controllers/handlerFactory');

//set storage location and filename (used when no image processing is required)
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // formate: user-{{userID}}-{{timestamp}}
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

//used when image processing is required right after the image is uploaded
const multerStorage = multer.memoryStorage();

//set filter to upload only images
const multerFiler = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images.', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFiler });

exports.uploadUserPhoto = upload.single('photo'); // upload single photo

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// RouteHandlers
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUsers = factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for password update, please use /updateMypassword',
        400,
      ),
    );
  }

  //filter out unwanted field names that are not allowed to be udpated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  //update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.updateUser = factory.updateOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);
