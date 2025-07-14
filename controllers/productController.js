const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order')
const path = require('path');
const fs = require('fs');
// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET one product by custom id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// CREATE a new product with auto-incremented id
exports.createProduct = async (req, res) => {
  try {
    // const lastProduct = await Product.findOne().sort({ id: -1 });
    const lastProduct = await Product.aggregate([
  {
    $addFields: {
      idAsNumber: { $toInt: "$id" }
    }
  },
  { $sort: { idAsNumber: -1 } },
  { $limit: 1 }
]);

  
    //  const newId = lastProduct ? parseInt(lastProduct.id) + 3 : 1;
    const newId= lastProduct.length ? String(lastProduct[0].idAsNumber + 1) : "1";
    const {  name, category, price, description } = req.body;
    const size = JSON.parse(req.body.size);
    const color = JSON.parse(req.body.color);
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      id: newId.toString(),
      name,
      category,
      price,
      description,
      size,
      color,
      image: imagePath
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// UPDATE product by custom id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Parse fields
    const updatedFields = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      size: JSON.parse(req.body.size),
      color: JSON.parse(req.body.color)
    };

    // Handle image update
    if (req.file) {
      // Optionally delete old image file from server
      if (product.image && fs.existsSync(path.join(__dirname, '..', product.image))) {
        fs.unlinkSync(path.join(__dirname, '..', product.image));
      }

      updatedFields.image = `/uploads/${req.file.filename}`;
    } else {
      updatedFields.image = req.body.image; // keep existing image if no new file
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      updatedFields,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    console.error('Update error:', error);
    if (error.code === 11000 && error.keyPattern?.id) {
      return res.status(400).json({ error: 'Product ID already exists' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE product by custom id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

//counter for dashboard
exports.getDashboardCounts = async (req, res) => {
  try {
    // Count products by category
    const menCount = await Product.countDocuments({ category: 'Men' });
    const womenCount = await Product.countDocuments({ category: 'Women' });
    const accessoriesCount = await Product.countDocuments({ category: 'Accessories' });

    // Count all users
    const userCount = await User.countDocuments();
     const Allproduct = await Product.countDocuments();

    // Count all orders
    const orderCount = await Order.countDocuments();

    // Send all counts
    res.status(200).json({
      productCounts: {
        Men: menCount,
        Women: womenCount,
        Accessories: accessoriesCount
      },
      userCount,
      orderCount,
      Allproduct
    });
  } catch (error) {
    console.error('Dashboard count error:', error);
    res.status(500).json({ error: 'Failed to fetch counts' });
  }
};