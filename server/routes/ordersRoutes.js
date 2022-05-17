const express = require('express');

const { protectToken } = require('../middlewares/usersMiddlewares');

const {
  protectOrderAccountOwner,
} = require('../middlewares/ordersMiddlewares');

const {
  createOrder,
  myOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/ordersController');

const router = express.Router();

router.use(protectToken);

router.get('/me', myOrders);

router.post('/', createOrder);

router
  .route('/:id')
  .patch(protectOrderAccountOwner, updateOrder)
  .delete(protectOrderAccountOwner, deleteOrder);

module.exports = { ordersRouter: router };
