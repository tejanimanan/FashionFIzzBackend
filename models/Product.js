const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  size: [{ type: String }],
  color: [{ type: String }],
  image: { type: String }
}, {
  collection: 'products',
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
