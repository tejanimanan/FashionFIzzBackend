const Cart = require('../models/Cart');

// GET all cart items for a specific user
exports.getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItems = await Cart.find({ userId });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};

// ADD a product to the cart
exports.addToCart = async (req, res) => {
    try {
         const lastProduct = await Cart.findOne().sort({ id: -1 });
             const newId = lastProduct ? parseInt(lastProduct.id) + 2 : 1;
        const {productId, userId, price, quantity, name, size, color, image } = req.body;
        const selectedSize = Array.isArray(size) ? size[0] : size;
        const selectedColor = Array.isArray(color) ? color[0] : color;
        // Check if item already exists in cart (same product & user & size & color)
        const existingItem = await Cart.findOne({ productId, userId, size, color });

        if (existingItem) {
            // If already in cart, just update quantity
            existingItem.quantity += parseInt(quantity);
            await existingItem.save();
            return res.json({ message: 'Cart updated', cartItem: existingItem });
        }

        // If not in cart, create a new entry
        const newCartItem = new Cart({
            id: newId.toString(), // generate unique cart item id
            productId,
            userId,
            price,
            quantity,
            name,
            size: selectedSize,
            color: selectedColor,
            image
        });

        await newCartItem.save();
        res.status(201).json({ message: 'Added to cart', cartItem: newCartItem });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// UPDATE quantity of a cart item
exports.updateCartQuantity = async (req, res) => {
    try {
        const { id } = req.params; // cart item ID
        const { quantity } = req.body;

        const updatedItem = await Cart.findOneAndUpdate(
            { id },
            { quantity },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Quantity updated', cartItem: updatedItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update quantity' });
    }
};

// DELETE a cart item
exports.removeCartItem = async (req, res) => {
    try {
        const { id } = req.params; // cart item ID

        const deletedItem = await Cart.findOneAndDelete({ id });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Cart item removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
};
