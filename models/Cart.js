const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Cart item ID
  productId: { type: String, required: true },         // ID of the product
  userId: { type: String, required: true },            // ID of the user who added this cart item
  price: { type: Number, required: true },             // Product price
  quantity: { type: Number, required: true },          // Quantity selected
  name: { type: String, required: true },              // Product name
  size: { type: String, required: true },              // Selected size
  color: { type: String, required: true },             // Selected color
  image: { type: String, required: true }              // Product image path
}, {
  collection: 'carts',
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
