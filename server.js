const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();
app.use(cors()); // ✅ Enable CORS for all origins
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/product', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
