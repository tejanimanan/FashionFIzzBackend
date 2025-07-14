const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   id: { type: String, required: true, unique: true },
  userId: {
    type: String,
    required: true
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now }
}, {
  collection: 'orders',
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
