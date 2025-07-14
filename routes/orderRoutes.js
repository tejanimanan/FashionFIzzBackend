const express = require('express');
const router = express.Router();
const { placeOrder, getOrdersByUser, getAllOrders, deleteOrder, updateOrderStatus } = require('../controllers/orderController');

router.post('/', placeOrder);                // POST /api/order
router.get('/user/:userId', getOrdersByUser); // GET /api/order/user/:userId
router.get('/', getAllOrders);         // GET /api/order (admin)
router.delete('/:id',deleteOrder);    
router.put('/:id/status', updateOrderStatus);   

module.exports = router;

