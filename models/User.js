const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { type: String, required: true },
  phone: [{ type: String }],
  address: [{ type: String }],
  image: { type: String },
  role: { type: String }
}, {
  collection: 'user',
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
