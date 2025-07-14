const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById, updateUserProfile, getAllUsers } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.put('/:id', updateUserProfile);

module.exports = router;
