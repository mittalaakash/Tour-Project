const express = require('express');

const userController = require(`${__dirname}/../controllers/userController.js`);
const authController = require(`${__dirname}/../controllers/authController.js`);

const router = express.Router();

//Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateme', authController.protect, userController.updateMe);
router.delete('/deleteme', authController.protect, userController.deleteMe);

router.route('/').get(userController.getUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
