const Order = require('../models/Order');
const Cart = require('../models/Cart'); 
// Create a new order
exports.placeOrder = async (req, res) => {
  try {

    const lastOrder = await Order.findOne().sort({ id: -1 });
    const newId = lastOrder ? parseInt(lastOrder.id) + 1 : 1;

    const { userId, items, totalAmount, deliveryAddress, paymentMethod, status, orderDate } = req.body;

    if (!userId || !items || !totalAmount || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
        
    const newOrder = new Order({
      id:newId.toString(),
      userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: status || 'pending',
      orderDate: orderDate || new Date()
    });

    await newOrder.save();
    await Cart.deleteMany({ userId });
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all orders (admin use)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Fetch All Orders Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
// UPDATE order status by ID
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { id: id.toString() },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// DELETE an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findOneAndDelete({id:id});

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully', deletedOrder });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

