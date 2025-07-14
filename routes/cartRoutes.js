const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getUserCart);            // Get all cart items for user
router.post('/', cartController.addToCart);                    // Add item to cart
router.put('/:id', cartController.updateCartQuantity);         // Update quantity
router.delete('/:id', cartController.removeCartItem);          // Delete item

module.exports = router;
