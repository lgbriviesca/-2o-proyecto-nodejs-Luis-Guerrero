const express = require('express');
const { body } = require('express-validator');

// Middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/usersMiddlewares');

const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

// Controller
const {
  /* getAllUsers, */
  createUser,
  updateUser,
  deleteUser,
  login,
  getOrders,
  getOrdersById,
} = require('../controllers/usersController');

const router = express.Router();

/* router.get('/', getAllUsers); */

router.post('/signup', createUserValidations, checkValidations, createUser);

router.post('/login', login);

router.use(protectToken);

router.get('/orders', getOrders);

router.get('/orders/:id', getOrdersById);

router
  .use('/:id', userExists, protectAccountOwner)
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

module.exports = { usersRouter: router };
