const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardCounts
} = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store in uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

router.get('/dashboard-counts',getDashboardCounts); 
router.post('/',upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/:id',   getProductById);
router.put('/:id',upload.single('image'),  updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
