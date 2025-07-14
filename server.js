const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();
app.use(cors()); // ✅ Enable CORS for all origins
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/product', productRoutes);
app.use('/api/cart',cartRoutes );
app.use('/api/user',userRoutes );
app.use('/api/order', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
