const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { getAuth } = require('@clerk/express');
const {protect,checkAuth} = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  console.log('=== GET /orders request received ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    console.log('Authenticated User ID:', req.userId);
    
    if (!req.userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ error: 'Unauthorized: No user ID found' });
    }
    
    const userId = req.userId;
    console.log('Fetching orders for user:', userId);
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
      
    console.log(`Found ${orders.length} orders for user ${userId}`);

    // Calculate total holdings and P&L
    const holdings = {};
    const pnl = {};
    
    orders.forEach(order => {
      if (!holdings[order.coinId]) {
        holdings[order.coinId] = 0;
        pnl[order.coinId] = 0;
      }
      
      if (order.type === 'buy') {
        holdings[order.coinId] += order.quantity;
      } else {
        holdings[order.coinId] -= order.quantity;
      }
    });

    // Add holdings and P&L info to each order
    const enhancedOrders = orders.map(order => ({
      ...order.toObject(),
      holdings: holdings[order.coinId] || 0,
      pnl: pnl[order.coinId] || 0
    }));

    console.log('Sending enhanced orders response');
    res.json(enhancedOrders);
  } catch (error) {
    console.error('Error in GET /orders:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { coinId, type, quantity, price, symbol, selectedCurrency } = req.body;

    if (!coinId || !type || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = new Order({
      userId,
      coinId,
      symbol,
      selectedCurrency,
      type,
      quantity,
      price,
      totalCost: type === 'buy' ? quantity * price : -1 * (quantity * price)
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const userId = req.userId;
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId
    }).exec();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});



// Sell an order
router.put('/:id/sell', async (req, res) => {
  try {
    const userId = req.userId;
    const { sellPrice, pnl, pnlPercentage } = req.body;

    // Find the order
    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order with sell information
    order.status = 'completed';
    order.completedAt = new Date();
    order.sellPrice = sellPrice;
    order.pnl = pnl;
    order.pnlPercentage = pnlPercentage;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error selling order:', error);
    res.status(500).json({ error: 'Failed to sell order' });
  }
});

module.exports = router;
