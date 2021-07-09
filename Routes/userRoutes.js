const express = require('express');
const multer = require('multer');
const userController = require(`${__dirname}/../controllers/userController.js`);
const authController = require(`${__dirname}/../controllers/authController.js`);

const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

//Routes

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.use(authController.protect); //protect all routes after this middleware

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateme', upload.single('photo'), userController.updateMe);
router.delete('/deleteme', userController.deleteMe);

router.use(authController.restrictTo('admin')); //restricting all routes to admin after this middleware

router.route('/').get(userController.getUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
